var express = require('express');
var url = require('url');
var router = express.Router();
var Sites = require('../../model').Sites;
var User = require('../../model').User;
var request = require('request');
var domain_info = require('domain-info'); //whois server client
var dns = require('dns');
var webshot = require('webshot');
var path = require('path');
var fs = require('fs');
var Utils = require("../../../out/utils/utils");
var cheerio = require("cheerio");
var _ = require('lodash');
var $;
var createDOM = function(dom) {
    $ = cheerio.load(dom, { decodeEntities: false });
    return $('body');
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        next();
    } else {
        res.json(false);
    }
}

router.post('/check', isLoggedIn, function(req, res) {
    var link = req.body.url;
    var opts = {
        url: link,
        gzip: true,
        json: true
    }

    User.checkUserStatus(req.user.id).then( (data) => {
        if (data.result) {
            request(opts, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    User.updateSeoTries(req.user.id, data.result - 1).then(()=> {
                        res.send(200, {body: body, header: response.headers});
                    });
                } else {
                    res.status(400).json({error: "Oops !!! An error occured.Please enter a valid url."});
                }
            });
        } else if (data.error) {
            res.status(400).json({error: data.error});
        }
    }, err => {
        res.status(400).json(err);
    } );
});

router.post("/requestToSites", isLoggedIn, function(req, res) {
    var el = req.body.url;
    var path = el;
    var opts = {
        uri: path,
        gzip: true
    }
    var startDate = new Date().getTime();
    request(opts, function (error, response, body) {
        var endDate = new Date().getTime();
        if (!error && response.statusCode == 200) {
            res.send(200,{time:(endDate-startDate)/1000 });
        }
        else {
            res.send(400,{ body: "Nothing to found" });
        }
    })
});

router.post("/getRobotData",isLoggedIn, function(req, res) {
    var link = req.body.url;
    var opts = {
        uri: link,
        gzip: true
    }
    request(opts, function (error, response, body) {
        if (!error && response.statusCode == 200 &&  response.headers['content-type'] == 'text/plain') {
            res.send(200,{ body: body });
        } else {
            res.send(200, { body: false });
        }
    });
});

router.post("/fingGoogle", function(req, res) {
    var el = req.body.el;
    var path = "https://www.google.com/search?q=" + encodeURIComponent(el);
    request(path, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(200, { body: body });
        } else  {
            res.send(response.statusCode, {error: response.statusCode});
        }
    })
});

router.post("/getSiteMapTxt", isLoggedIn, function(req, res) {
    var link = req.body.url;
    var opts = {
        uri: link,
        gzip: true
    }

    request(opts, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(200, { body: body });
        } else  {
            res.send(200, { body: false });
        }
    });
});

router.post("/getSiteMap", isLoggedIn, function(req, res) {
    var link = req.body.url;
    var opts = {
        uri: link,
        gzip: true,
        timeout: 5000
    }

    request(opts, function (error, response, body) {
        if (!error && response.statusCode == 200  && response.headers['content-type'] == 'text/xml') {
            res.send({ body: body});
        } else {
            res.send({ body: false});
        }
    });
});

router.post("/getWhois", isLoggedIn, function(req, res) {
    var link = req.body.url;
    domain_info.groper(link, 'A', function(err, data) {
        res.send(200, { body: data });
    });
});

router.post("/getDescriptionFromGoogle", isLoggedIn, function(req, res) {
    var link = req.body.url;
    var opts = {
        uri: link,
        gzip: true
    }
    request(opts, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send({ body: body });
        } else {
            res.send({body: false });
        }
    });
});

router.post("/getFavicon", isLoggedIn, function(req, res) {
    var link = req.body.url;
    var opts = {
        uri: link,
        gzip: true
    }
    request(opts, function (error, response, body) {
        if (!error && response.statusCode == 200 ) {
            res.send({ body: "ok" });
        } else {
            res.send({body: false });
        }
    });
})

router.post("/getScreenShot", isLoggedIn, function(req, res) {
    var url = req.body.url;
    var renderStream = webshot(url, {
        windowSize: {
            width: 800,
            height: 800
        }
    });
    var imgName = Date.now() + '.png';
    var dest = path.join(path.dirname(process.mainModule.filename), '/public/images/' + imgName);
    var file = fs.createWriteStream(dest, {encoding: 'binary'});
    renderStream.on('data', function(data) {
        file.write(data.toString('binary'), 'binary');
    });

    renderStream.on('end', function () {
        res.send({result: imgName});
    });
});

router.post("/getSitesByUserId", isLoggedIn, function(req, res) {
    var userId = req.user.id;
    var body = req.body;
    var limit = parseInt(body.limit);
    var str = body.str;
    var skip = body.skip ? parseInt(body.skip) : 0;
    Sites.getSitesByUserId({
        userId: userId,
        str: str,
        limit: limit,
        skip: skip
    }).then(function (data) {
        res.send(data);
    });
});


router.get('/getSitesByUserIdFromAdmin/:id', function(req, res) {
    var userId = req.params.id;
    Sites.getSitesByUserIdFromAdmin({
        userId: userId,
    }).then(function (data) {
        res.send(data);
    });
});

router.post("/saveData", isLoggedIn, function(req,res) {
    var valid = 0;
    var warning = 0;
    var critical = 0;
    var problematicData = [];
    var body = req.body;
    var bodyData = body.data;
    var allDom = createDOM(bodyData.result);
    var userId = req.user.id;
    var designScore = designScoreCount(bodyData, allDom);
    var seoScore = seoScoreCount(bodyData, allDom);
    var accessibilityScore = accessibilityScoreCount(bodyData, allDom);
    var performanceScore = performanceScoreCount(bodyData, allDom);
    var contentScore = contentScoreCount(bodyData, allDom);
    delete body.data.result;
    Sites.saveData(body, designScore, seoScore, accessibilityScore, performanceScore, contentScore, userId).then(function (data) {
        res.send(data);
    });
});

router.post("/getSiteByUser", isLoggedIn, function(req, res) {
    var userId = req.user.id;
    var siteId = req.body.siteId;
    Sites.getSiteByUser({
        userId: userId,
        siteId: siteId
    }).then(function (data) {
        res.send(data);
    });
});

router.post("/deleteData", isLoggedIn, function(req, res) {
    var userId = req.user.id;
    var id = req.body.id;
    Sites.getSiteByUser({
        userId: userId,
        siteId: id
    }).then(result => {
        var screenShot = JSON.parse(result.data).data.screenShot;
        var dest = path.join(__dirname, '../../../public/images/');
        var filename = dest + screenShot ;
        fs.unlink(filename, function () {
            Sites.deleteData({
                userId: userId,
                id: id
            }).then(function (data) {
                res.send(200, data);
            });
        })
    });
});

function isValid(str){
    return !/[~`!#$%\^&*+=\-\[\]\\';,/{}()|\\":<>\?]/g.test(str);
}

/* Content tab functions*/

var contentScoreCount = function(data,allDom) {
    var problematicData = [];
    var good = 0;
    var bad = 0;
    var perfect = 0;
    var percentsInTextClass = 0;
    var countInfoClass = 0;
    var titleCohanceClass = 0;
    var keywordDensityClass = 0;
    var microdataArrayClass = 0;

    var counts = getCountOf_H(allDom);
    var countInfo = {
        h1Count: counts.h1,
        h2Count: counts.h2,
        h3Count: counts.h3,
        h4Count: counts.h4,
        h5Count: counts.h5,
        h6Count: counts.h6
    }

    var microdataArray = checkMicrodata(allDom);
    stripScripts(allDom);
    stripStyle(allDom);
    var resultOfBody = getTags(allDom);
    var result = resultOfBody.replace(/(?:\r\n|\n|\r)/g, ' ').replace(/^\s+|\s+$|\s+(?=\s)|\+/g, ' ').replace(/\,/g, ' ').replace(/[0-9]/g, ' ');
    // var removeNumbers = resultOfBody.replace(/[0-9]/g, ' ');
    // var removeSymbols = removeNumbers.replace(/[&\/\\#,+()$~%.'":!@*?<>{}]/g,'');
    var keywordArray = result.split(" ");
    var keywords1 = [];
    var keywordArrayAll = [];
    for (var i = 0; i < keywordArray.length; i++) {
        if (isValid(keywordArray[i])) {
            keywordArrayAll.push(keywordArray[i]);
        }
    }

    for (var i = 0; i < keywordArrayAll.length; i++) {
        if (keywordArrayAll[i].length > 3) {
            keywords1.push(keywordArrayAll[i]);
        }
    }
    var keywords2 = chunkArray(keywords1, 2);
    var keywords3 = chunkArray(keywords1, 3);

    //var keywordArray3 = removeSymbols.split(" ", 3);

    var tmp = $("<div>");
    var currentText = $(allDom).text();
    $(tmp).text(currentText);
    var s = $(tmp).text().trim();
    s = s.replace(/(?:\r\n|\n|\r)/g, '').replace(/^\s+|\s+$|\s+(?=\s)|\+/g, '').replace(/\,/g, "").replace(/[0-9]/g, '');
    var allTExt = s.split(" ");
    var tagsArray = getTagWithValue(allDom);
    var percentsInText = textInPercent(s.length, data.result.length);
    //var keywordsOfTwoWords = this.keywordCount(s, this.chunkArray(s.split(" "), 2));
    var keywords1Count = countKey(keywords1);
    var keywords2Count = countKey(keywords2);
    var keywords3Count = countKey(keywords3);
    var cloudData = [];
    var keywordCountArray1 = [];

    for (var key1 in keywords1Count) {
        var repetitionOfKeyword = Math.ceil((keywords1Count[key1] / keywordArrayAll.length) * 100)
        if (cloudData.length <= 50) {
            var currentData = [];
            currentData.push(key1, keywords1Count[key1] * 10);
            cloudData.push(currentData);
        }
        keywordCountArray1.push({
            name: key1,
            value: keywords1Count[key1],
            density: repetitionOfKeyword
        })
    }

    var keywordCountArray2 = [];
    for (var key2 in keywords2Count) {
        var repetitionOfKeyword = Math.ceil((keywords2Count[key2] / keywordArrayAll.length) * 100);
        keywordCountArray2.push({
            name: key2,
            value: keywords2Count[key2],
            density: repetitionOfKeyword
        })
    }

    var keywordCountArray3 = [];
    for (var key3 in keywords3Count) {
        var repetitionOfKeyword = Math.ceil((keywords3Count[key3] / keywordArrayAll.length) * 100);
        keywordCountArray3.push({
            name: key3,
            value: keywords3Count[key3],
            density: repetitionOfKeyword
        })
    }

    var mainKeywords = [];
    var quantityKeyword = 0;
    var keywordRepetition = 0;
    var keywordsCounts = 0;
    var checkTitle = [];
    var titleCohance = [];
    checkTitle = checkTitle_(allDom);
    titleCohance = compareArrays(checkTitle, mainKeywords);

    if (percentsInText >= 15) {
        perfect++;
        percentsInTextClass = 0;
    }
    if (percentsInText < 15 && percentsInText > 0) {
        good++;
        percentsInTextClass = 1;
        problematicData.push('Problem with percent in text');
    } else {
        bad++;
        percentsInTextClass = 2;
        problematicData.push('Problem with percent in text');
    }

    if (countInfo.h1Count > 0 && countInfo.h2Count > 0 && countInfo.h3Count && countInfo.h4Count > 0 && countInfo.h5Count > 0 && countInfo.h6Count) {
        perfect++;
        countInfoClass = 0;
    }
    if (countInfo.h1Count > 0) {
        good++;
        countInfoClass = 1;
        problematicData.push('Problem with some h tags');
    } else {
        bad++;
        countInfoClass = 2;
        problematicData.push('Problem with some h tags');
    }

    if (titleCohance.length > 0) {
        perfect++;
        titleCohanceClass = 0;
    } else {
        bad++;
        titleCohanceClass = 2;
        problematicData.push('Problem with title Cohance');
    }

    if (microdataArray) {
        perfect++;
        microdataArrayClass = 0;
    } else {
        problematicData.push('Problem with Microdata');
        good++;
        microdataArrayClass = 1;
    }

    return {
        percentsInText: percentsInText,
        percentsInTextClass: percentsInTextClass,
        countInfo: countInfo,
        countInfoClass: countInfoClass,
        titleCohance: titleCohance,
        titleCohanceClass: titleCohanceClass,
        keywordCountArray1: keywordCountArray1,
        keywordCountArray2: keywordCountArray2,
        keywordCountArray3: keywordCountArray3,
        quantityKeyword: quantityKeyword,
        microdataArrayClass: microdataArrayClass,
        microdataArray: microdataArray,
        checkTitle: checkTitle,
        cloudData: cloudData,
        problematicData: problematicData,
        validContent: Utils.percent(perfect, 5),
        score: {
            good: good,
            bad: bad,
            perfect: perfect
        }
    }
}

var getTags = function(dom) {
    var coinsArray = [];
    var getTitleTag = $('title');
    var getHrefTags = $('a');
    var getH1 = $('h1');
    var getH2 = $('h2');
    var getH3 = $('h3');
    var getH4 = $('h4');
    var getH5 = $('h5');
    var getH6 = $('h6');
    var getMeta = $('meta');
    var getImg = $('img');
    // getH2.prototype.slice.call( 'htmlCollection' );
    // var getH = getH1.concat(getH2,getH3,getH4,getH5,getH6);


    //TODO with function

    if (getTitleTag && getTitleTag.length > 0) {
        if (getTitleTag[0].children[0]) {
            coinsArray.push(getTitleTag[0].children[0].data);
        }
    }
    if (getHrefTags && getHrefTags.length > 0) {
        for (var i = 0; i < getHrefTags.length; i++) {
            var getHrefTag = $(getHrefTags[i]).text().split("\n");
            for (var j = 0; j < getHrefTag.length; j++) {
                if (getHrefTag[j].trim() != "") {
                    coinsArray.push(getHrefTag[j].trim());
                }
            }
        }
    }

    if (getH1.length > 0) {
        for (var i = 0; i < getH1.length; i++) {
            var h1 = $(getH1[i]).text().split("\n");
            for (var j = 0; j < h1.length; j++) {
                if (h1[j].trim() != "") {
                    coinsArray.push(h1[j].trim());
                }
            }
        }
    }

    if (getH2.length > 0) {
        for (var i = 0; i < getH2.length; i++) {
            var h2 = $(getH2[i]).text().split("\n");
            for (var j = 0; j < h2.length; j++) {
                if (h2[j].trim() != "") {
                    coinsArray.push(h2[j].trim());
                }
            }
        }
    }

    if (getH3.length > 0) {
        for (var i = 0; i < getH3.length; i++) {
            var h3 = $(getH3[i]).text().split("\n");
            for (var j = 0; j < h3.length; j++) {
                if (h3[j].trim() != "") {
                    coinsArray.push(h3[j].trim());
                }
            }
        }
    }

    if (getH4.length > 0) {
        for (var i = 0; i < getH4.length; i++) {
            var h4 = $(getH4[i]).text().split("\n");
            for (var j = 0; j < h4.length; j++) {
                if (h4[j].trim() != "") {
                    coinsArray.push(h4[j].trim());
                }
            }
        }
    }

    if (getH5.length > 0) {
        for (var i = 0; i < getH5.length; i++) {
            var h5 = $(getH5[i]).text().split("\n");
            for (var j = 0; j < h5.length; j++) {
                if (h5[j].trim() != "") {
                    coinsArray.push(h5[j].trim());
                }
            }
        }
    }

    if (getH6.length > 0) {
        for (var i = 0; i < getH6.length; i++) {
            var h6 = $(getH6[i]).text().split("\n");
            for (var j = 0; j < h6.length; j++) {
                if (h6[j].trim() != "") {
                    coinsArray.push(h6[j].trim());
                }
            }
        }
    }

    if (getTitleTag.length > 0) {
        coinsArray.push($(getTitleTag[0]).text());
    }

    if (getMeta.length > 0) {
        for (var i = 0; i < getMeta.length; i++) {
            if (getMeta[i].attribs.name == 'keywords' || getMeta[i].attribs.name == 'description') {
                if (getMeta[i] && getMeta[i].attribs.content != "") {
                    coinsArray.push(getMeta[i].attribs.content);
                }
            }
        }
    }
    if (getImg.length > 0) {
        for (var i = 0; i < getImg.length; i++) {
            var imgAlt = getImg[i].attribs.alt;
            if (imgAlt && imgAlt != "") {
                coinsArray.push(imgAlt);
            }
        }
    }
    return coinsArray.join();
}

var keywordsInTags = function(tags, keywords) {
    var allArray = [];
    for (var i = 0; i < keywords.length; i++) {
        var keyword = keywords[i];
        if (keyword.length > 2) {
            var repeatsInTags = [];
            for (var j = 0; j < tags.length; j++) {
                var count = 0;
                var content = tags[j].value.textContent.split(" ");
                var tag = tags[j].tag;
                for (var k = 0; k < content.length; k++) {
                    if (keyword.indexOf(content[k]) >= 0) {
                        repeatsInTags.push(tag);
                    }
                }
            }
            if (repeatsInTags.length > 0) {
                allArray.push({
                    keyword: keyword,
                    repeatsInTags: repeatsInTags
                });
            }
        }
    }
}

var stripScripts = function(s) {
    $(s).find('script').remove();
    return $(s).wrap("<div>").parent().html();
}

//Remove all Styles
var stripStyle = function(s) {
    $(s).find('style').remove();
    return $(s).wrap("<div>").parent().html();
}

var textInPercent = function(strLength,domLength) {
    return (strLength * 100 / domLength).toPrecision(3);
}

var chunkArray = function(arr, chunkSize) {
    var groups = [], i;
    for (i = 0; i < arr.length; i += chunkSize) {
        groups.push(arr.slice(i, i + chunkSize).join(" "));
    }
    return groups;
}

var getCountOf_H = function(el) {
    var h1 = $('h1');
    var h2 = $('h2');
    var h3 = $('h3');
    var h4 = $('h4');
    var h5 = $('h5');
    var h6 = $('h6');
    return {
        h1: h1.length,
        h2: h2.length,
        h3: h3.length,
        h4: h4.length,
        h5: h5.length,
        h6: h6.length
    }
}

var getTagWithValue = function(el) {
    var tags = el;
    var array = [];
    /*for(var i = 0 ; i < tags.length; i++) {
        if(tags[i].tagName.toLowerCase() != "script" && tags[i].tagName.toLowerCase() != "meta") {
            if (tags[i].childNodes.length == 1 ) {
                array.push({
                    tag: tags[i].tagName,
                    value: tags[i].childNodes[0],
                    type: tags[i].childNodes
                })
            }
        }
    }*/
    $(el).children().each(function(i, element) {
        if(element.tagName.toLowerCase() != "script" && element.tagName.toLowerCase() != "meta") {
            if (element.childNodes.length == 1 ) {
                array.push({
                    tag: element.tagName,
                    type: element.type
                })
            }
        }
        console.log(element.tagName)
    })
    return array;
}

var countKey = function(array_elements) {
    array_elements.sort();
    var keys = {};
    var current = null;
    var cnt = 0;
    for (var i = 0; i < array_elements.length; i++) {
        if (array_elements[i].length > 3) {
            if (array_elements[i] != current) {
                if (cnt > 0) {
                    keys[current] = cnt;
                }
                current = array_elements[i];
                cnt = 1;
            } else {
                cnt++;
            }
            keys[current] = cnt
        }
    }
    return keys;
}

var checkMicrodata = function(el) {
    var meta = $('[itemtype]');
    var microdata = [];
    for (var i = 0; i < meta.length; i++) {
        var itemtype = meta[i].attribs.itemtype;
        if (meta[i].attribs.itemtype) {
            microdata.push(meta[i].attribs.itemtype);
        }
    }
    return microdata;
}

var checkTitle_ = function(dom) {
    var title = $('title').length > 0 ? $('title').html() : "";
    return title.split(" ");
}

var compareArrays = function(arr1, arr2) {
    return  _.intersection(arr1, arr2);
}

/* End content tab functions*/
/*PerformanceScoreCount functions*/
var performanceScoreCount = function(data, allDom) {
    var problematicData = [];
    var caching = data.caching;
    var good = 0;
    var bad = 0;
    var perfect = 0;
    var locatedCriptsClass = 0;
    var contentLengthClass = 0;
    var stylesClass = 0;
    var scriptClass = 0;
    var cachingClass = 0;
    var inlineClass = 0;
    var getInlineStyles = getInlineStyles_(allDom).length > 0 ? getInlineStyles_(allDom) : "";
    var styles = getStylesTag();
    var locatedScripts = locatedScripts_(allDom);
    var realStylePercent = countMb(styles);
    var realScriptsPercent = getIntegratedScript(allDom);
    var contentLength = data.contentLength > 0 ? (data.contentLength / 1024).toPrecision(3) : 0;
    var timeClass = 0;
    var time = data.time;

    if (time <= 100) {
        perfect++;
        timeClass = 0;
    } else {
        good++;
        timeClass = 1;
        problematicData.push('Problem with Time');
    }

    if (contentLength > 50) {
        good++;
        contentLengthClass = 1;
        problematicData.push('Problem with content Length');
    } else {
        perfect++;
        contentLengthClass = 0;
    }

    if (locatedScripts != null && locatedScripts.length > 0) {
        good++;
        locatedCriptsClass = 1;
        problematicData.push('Problem with located Scripts');
    } else {
        perfect++;
        locatedCriptsClass = 0;
    }

    if (realStylePercent > 0) {
        good++;
        stylesClass = 1;
        problematicData.push('Problem with style  percent');
    } else {
        perfect++;
        stylesClass = 0;
    }
    if (realScriptsPercent > 0) {
        good++;
        scriptClass = 1;
        problematicData.push('Problem with real script  percent')
    } else {
        perfect++;
        scriptClass = 0;
    }

    if (caching) {
        perfect++;
        cachingClass = 0;
    } else {
        good++;
        cachingClass = 1;
        problematicData.push('Problem with caching')
    }
    if (getInlineStyles) {
        good++;
        inlineClass = 1;
        problematicData.push('Problem with inlne style')
    } else {
        perfect++;
        inlineClass = 0;
    }

    return {
        caching: caching,
        inlineClass: inlineClass,
        inlineStyles: getInlineStyles,
        cachingClass: cachingClass,
        scriptClass: scriptClass,
        locatedCriptsClass: locatedCriptsClass,
        stylesClass: stylesClass,
        realScriptsPercent: realScriptsPercent,
        realStylePercent: realStylePercent,
        locatedScripts: locatedScripts,
        contentLengthClass: contentLengthClass,
        contentLength: contentLength,
        time: time,
        timeClass: timeClass,
        problematicData: problematicData,
        validPerformance: Utils.percent(perfect, 7),
        score: {
            good: good,
            bad: bad,
            perfect: perfect
        }
    }
}

var locatedScripts_ = function(el) {
    var locatedScripts = [];
    var getTags = $('script[src]');
    for (var i = 0 ; i < getTags.length; i++) {
        var tag = getTags[i].attribs.src;
        if (tag && tag != "") {
            locatedScripts.push(tag);
        }
    }
    return locatedScripts;
}

var countMb = function(num) {
    var a = num/1024;
    var b =  a/1024;
    return Math.ceil(a);
}

var getStylesTag = function() {
    var getTagsLength = $('style') ? $('style').length : 0;
    return getTagsLength;
}

var getIntegratedScript = function(el) {
    var scripts = el.find('script');
    var count = 0;
    for (var i = 0 ; i < scripts.length; i++) {
        if (scripts[i].children[0]) {
            count += scripts[i].children[0].data.length;
        }
    }
    return count;
}

var getInlineStyles_ = function(el) {
    var getTags = $('[style]');
    var inlineStyles = [];
    for (var i = 0 ; i < getTags.length; i++) {
        var tag = getTags[i].attribs.style;
        inlineStyles.push(tag);
    }
    return inlineStyles;
}

//Design Tab
var findEmail = function(dom) {
    var email = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    return dom.match(email);
}

/*End PerformanceScoreCount functions*/

/* Accessibility functions*/
var accessibilityScoreCount = function(data,allDom) {
    var problematicData = [];
    var mainUrl = data.mainUrl;
    var fullUrl = data.fullUrl;
    var domain = data.domain;
    var good = 0;
    var bad = 0;
    var perfect = 0;
    var checkUrlForClean = fullUrl.indexOf(".") != -1 ? false : true;
    var noScript = getNoScript(allDom);
    var script_ = getScript(allDom);
    var bgSound = getBgSound(allDom);
    var favicon = data.favicon;
    var hTMLLang = getHTMLLng(allDom);
    var openGraph = getGraphOBJ(allDom);
    var twitterCard = getTwitterCard(allDom);
    var publisher = getPublisher(allDom);
    var viewPortData = viewPort(allDom);

    if(viewPortData) {
        perfect++;
    } else {
        good++;
        problematicData.push('problem with responsive');
    }

    if(publisher) {
        perfect++;
    } else {
        good++;
        problematicData.push('Problem With Publishers');
    }

    if(twitterCard['twitter:card']) {
        perfect++;
    } else {
        good++;
        problematicData.push('Problem with Twitter Obect');
    }

    if(openGraph['og:title'] &&  openGraph['og:description']  && openGraph['og:url']) {
        perfect++;
    } else {
        problematicData.push("Problem with ");
        good++;
    }
    if (hTMLLang) {
        perfect++;
    } else {
        good++;
        problematicData.push('Problem with content Lang');
    }

    if (favicon) {
        perfect++;
    } else {
        good++;
        problematicData.push("Problem with favicon");
    }
    if (bgSound) {
        good++;
        problematicData.push('Problem BGSOund');
    } else {
        perfect++;
    }

    if (script_) {
        if (noScript) {
            perfect++;
        } else {
            good++;
            problematicData.push("Problem With No Script");
        }
    }

    if (!checkUrlForClean) {
        good++;
        problematicData.push("Problem With URL Ceaning");
    } else {
        perfect++;
    }

    if (domain.length >= 15) {
        good++;
        problematicData.push("Problem with DomainLength");
    } else {
        perfect++;
    }

    return {
        checkUrlForClean: checkUrlForClean,
        domain: domain,
        getNoScript: noScript,
        script_: script_,
        getBgSound: bgSound,
        favicon: favicon,
        getHTMLLang: hTMLLang,
        openGraph: openGraph,
        getTwitterCard: twitterCard,
        getPublisher: publisher,
        viewPort: viewPortData,
        problematicData: problematicData,
        validAccessibility: Utils.percent(perfect, 10),
        score: {
            good: good,
            bad: bad,
            perfect: perfect
        }
    }
}

var getNoScript = function(dom) {
    var noScript = $('noscript').length ? true : false;
    return noScript;
}

var getScript = function(dom) {
    var script_ =  $('script').length ? true : false;
    return script_;
}

var getBgSound = function(dom) {
    var bgSound = $('bgsound ').length ? true : false;
    return bgSound;
}

var getInputs = function(dom) {
    var allInputs = $('input');
    return allInputs;
}



var getHTMLLng = function(dom) {
    var getHTMLLng = $('html');
    var HTMLLang = false;
    for (var i = 0; i < getHTMLLng.length; i++) {
        var lang = getHTMLLng[i].attribs.lang;
        if (lang) {
            return lang;
        } else
            return HTMLLang;
    }
}

var getGraphOBJ = function(dom) {
    var getMetas = $('meta');
    var metaTags = [];
    for (var i = 0; i < getMetas.length; i++) {
        if (getMetas[i].attribs.property) {
            metaTags.push(getMetas[i]);
        }
    }
    var arr = {};
    var og = /og:/gi;
    for (var i = 0; i < metaTags.length; i++) {
        if (metaTags[i].attribs.property.match(og)) {
            arr[metaTags[i].attribs.property] = metaTags[i].attribs.content;
        }
    }
    return arr;
}

var getTwitterCard = function(dom) {
    var getMetas = $('meta');
    var metaTags = [];
    for (var i = 0; i < getMetas.length; i++) {
        if (getMetas[i].attribs.name) {
            metaTags.push(getMetas[i]);
        }
    }
    var arr = {};
    var twitter = /twitter:/gi;
    for (var i = 0; i < metaTags.length; i++) {
        if (metaTags[i].attribs.name.match(twitter)) {
            arr[metaTags[i].attribs.name] = metaTags[i].attribs.content
        }
    }
    return arr;
}

var getPublisher = function(dom) {
    var getLink = $('link');
    // var publishers = [];

    for(var i = 0; i < getLink.length; i++) {
        if(getLink[i].attribs.rel && getLink[i].attribs.rel == 'publisher') {
            return getLink[i].attribs.href;
        }
    }
}

var viewPort = function(dom) {
    var isViewReport = false;
    var getMetas = $('meta');
    for(var i = 0 ; i < getMetas.length; i++) {
        if (getMetas[i].attribs.name && getMetas[i].attribs.name == 'viewport') {
            isViewReport = true;
            return isViewReport;
        }
    }
    return isViewReport;
}
/*End Accessibility functions*/

/*Seo functions*/
var seoScoreCount = function(data, allDom) {
    var problematicData = [];
    var good = 0;
    var bad = 0;
    var perfect = 0;
    var titleClass = 0;
    var metaDescriptionClass = 0;
    var metaDataClass = 0;
    var metaRobotTextClass = 0;
    var siteMapClass = 0;
    var canonicalClass = 0;
    var alternativeClass = 0;
    var correctLinkClass = 0;
    var externalClass = 0;
    var linkJuiceClass = 0;
    var descriptionContent = findeContentDescription(allDom);
    var metaRobotClass = 0;

    //with functions
    var title = getTitle(allDom);
    var titleCount = title.length ? title.length : 0;
    var metaDescription = descriptionContent ? descriptionContent : '';
    var descriptionCount = metaDescription.length > 0 ? metaDescription.length : 0;
    var metaData = getAllMeta(allDom);
    var isMetaRobotExist = isExist('robots', getAllMeta(allDom));
    var robotsText = data.robotResult ? "<pre>" + data.robotResult + "</pre>" : '';
    var siteMapXML = data.siteMapResult ? '<pre>' + data.siteMapResult + '</pre>' : '';
    var alternativeCount = countAlternativeText(allDom);
    var canonicalURL = getCanonical(allDom) ? getCanonical(allDom) : null;
    var alternative = getImages(allDom);
    var correctLinks = checkProperLinksCount(allDom);
    var followData = getExternalLinks(allDom, data.domain);
    var external = followData.external;
    var internal = followData.allLinks.length - followData.external;
    var follow = followData.follow;
    var followPercent = toCeil(follow.length,correctLinks.count);
    var followClass = 0;
    var externalPercent = toCeil(external, followData.allLinks.length);
    var underScoreCount = checkUnderscore(allDom,data.domain);
    var underscoreClass = 0;
    var underscorePercent = Utils.percent(underScoreCount,correctLinks.count);


    if(followPercent >= 70) {
        perfect++;
        followClass= 0;
    } else if(followPercent > 0 && followPercent < 70) {
        good++;
        followClass = 1;
        problematicData.push('Problem with FollowLinks');
    } else {
        bad++;
        followClass = 2;
        problematicData.push('Problem with Follow Links');
    }

    if(underscorePercent > 0) {
        good++;
        underscoreClass = 1;
        problematicData.push('Problem with Underscore');
    } else  {
        perfect++;
        underscoreClass = 0;
    }

    if (Utils.checkState(titleCount, 55, 65) == 0) {
        perfect++;
        titleClass = 0;
    } else if (Utils.checkState(titleCount, 55, 65) == 1) {
        good++;
        titleClass = 1;
        problematicData.push('Problem with title');
    } else if (Utils.checkState(titleCount, 55, 65) == 2) {
        bad++;
        titleClass = 2
        problematicData.push('Problem with title');
    }

    if (Utils.checkState(descriptionCount, 140, 170) == 0) {
        perfect++;
        metaDescriptionClass = 0;
    } else if (Utils.checkState(descriptionCount, 140, 170) == 1) {
        good++;
        metaDescriptionClass = 1;
        problematicData.push('Problem with Meta Description');
    } else if (Utils.checkState(descriptionCount, 140, 170) == 2) {
        bad++;
        metaDescriptionClass = 2;
        problematicData.push('Problem with Meta Description');
    }

    if (isMetaRobotExist) {
        perfect++;
        metaRobotClass = 0;
    } else {
        good++;
        metaRobotClass = 1;
        problematicData.push('Problem with meta data');
    }

    if(underScoreCount > 0) {
        good++;
        underscoreClass = 1;
        problematicData.push('Problem With Underscore of links')
    } else {
        perfect++;
        underscoreClass = 0;
    }
    if (robotsText.length > 0) {
        perfect++;
        metaRobotTextClass = 0;
    } else {
        good++;
        metaRobotTextClass = 1;
        problematicData.push('Problem with robot');
    }

    if (external < internal) {
        perfect++;
        linkJuiceClass = 0;
    } else {
        bad++;
        linkJuiceClass = 2;
        problematicData.push('Problem with Link Juice');
    }

    if (external <= internal) {
        perfect++;
        externalClass = 0;
    }  else {
        bad++;
        externalClass = 2;
        problematicData.push('Problem with External ');
    }

    if (siteMapXML.length > 0) {
        perfect++;
        siteMapClass = 0;
    } else {
        good++;
        siteMapClass = 1;
        problematicData.push('Problem with site Map');
    }

    if (canonicalURL) {
        perfect++;
        canonicalClass = 0;
    } else {
        good++;
        canonicalClass = 1;
        problematicData.push('Problem with canonical URL');
    }

    if (alternative.length > 0) {
        perfect++;
        alternativeClass = 0;
    } else {
        good++;
        alternativeClass = 1;
        problematicData.push('Problem with Alternative text ');
    }

    if (correctLinks.count > 30 && correctLinks.count < 100) {
        perfect++;
        correctLinkClass = 0;
    } else if (correctLinks.count <= 0) {
        bad++;
        correctLinkClass = 2;
        problematicData.push('Problem with correctLinks');
    } else {
        good++;
        correctLinkClass = 1;
        problematicData.push('Problem with correctLinks');
    }

    if (external > internal) {
        bad++;
        problematicData.push('External > Internal ');
    } else {
        perfect++
    }

    return {
        follow : follow,
        followPercent : followPercent ,
        followClass: followClass,
        allLinks: followData.allLinks,
        allLinksCount: followData.allLinks.length,
        title: title,
        underScoreCount: underScoreCount,
        underscorClass: underscoreClass,
        followPercent: 0,
        titleClass: titleClass,
        titleCount: titleCount,
        externalPercent: externalPercent,
        metaDescription: metaDescription,
        metaDescriptionClass: metaDescriptionClass,
        descriptionCount: descriptionCount,
        metaRobotClass: metaRobotClass,
        metaRobotTextClass: metaRobotTextClass,
        isMetaRobotExist: isMetaRobotExist,
        metaDataClass: metaDataClass,
        robotsText: robotsText,
        robotsTextLength: robotsText.length,
        siteMapClass: siteMapClass,
        siteMapXML: siteMapXML,
        canonicalClass: canonicalClass,
        canonicalURL: canonicalURL,
        correctLinkClass: correctLinkClass,
        alternativeClass: alternativeClass,
        alternative: alternative,
        alternativeTextCount: alternativeCount,
        followData: followData,
        metaData: metaData,
        correctLinks: correctLinks,
        correctLinksCount:correctLinks.count,
        externalClass: externalClass,
        external: external,
        linkJuiceClass: linkJuiceClass,
        problematicData: problematicData,
        validSeo: Utils.percent(perfect, 12),
        score: {
            good: good,
            bad: bad,
            perfect: perfect
        },
        underscorePercent: underscorePercent,
        underScoreCount:underScoreCount,
        underscoreClass:underscoreClass
    }
}



var countAlternativeText = function(dom) {
    var img = $('img[alt]');
    return img.legth;
}

var toCeil = function(follow, links){
    var a = 0;
    a = (100 * follow) / links;
    return Math.ceil(a);
}

var findeContentDescription = function(el) {
    var meta = $('meta');
    var description = '';
    for(var i = 0 ; i < meta.length; i++) {
        if(meta[i].attribs.name == 'description') {
            description = meta[i].attribs.content;
        }
    }
    return description;
}


var getTitle = function(el) {
    var titles = $('title');
    var title = '';
    title += titles.length > 0 ? titles.html() : "";
    return title;
}

var getAllMeta = function(el) {
    var meta = $('meta');
    var metas = [];
    for(var i = 0; i < meta.length; i++) {
        var element = {
            type_: Object.keys(meta[i].attribs)[0],
            meta_: meta[i].attribs[Object.keys(meta[i].attribs)[0]] != null ? meta[i].attribs[Object.keys(meta[i].attribs)[0]] : '' ,
            content: meta[i].attribs.content != null ? meta[i].attribs.content : ''
        };
        metas.push(element);
    }
    return metas;
}

var isExist = function(str , tag) {
    var a;
    _.each(tag, function(tag_){
        if(tag_.content == str) {
            a =  tag_.meta_;
        }
    });
    return a;
}

var getCanonical = function(el) {
    var links = $('link');
    var canonical;
    for(var i = 0 ; i < links.length; i++) {
        var rel = links[i].attribs.rel;
        if(rel == 'canonical') {
            canonical = links[i].href;
        }
    }
    return canonical;
}

var getImages = function(dom) {
    var img = $('img');
    var alternatives = [];
    for (var i = 0; i < img.length; i++) {
        alternatives.push({
            image: img[i].attribs.src,
            alt: img[i].attribs.alt
        });
    }
    return alternatives;
}

var checkUnderscore = function(el,str) {
    var countUnderscrore = 0;
    var links = checkProperLinksCount(el);
    var linksData = links.data;
    for(var i = 0 ; i < linksData.length; i++) {
       var  link = (linksData[i]).replace(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/igm, '$4');
        if (link) {
            if (link !== str) {
                if (link.indexOf('_') !== -1) {
                    countUnderscrore++;
                }
            }
        }
    }
    return countUnderscrore;
}

var checkProperLinksCount = function(el) {
    var links = getAllLinks(el);
    var correctURL = [];
    var allLinks = [];
    var followCount = 0;
    var noFollowCount = 0;
    var rel = null;
    var count = 0;
    var urlpattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
    for (var i = 0 ; i < links.length; i++) {
        allLinks.push(links[i].attribs.href);
        rel = links[i].attribs.rel;
        if (rel) {
            if(rel == "nofollow") {
                noFollowCount++
            } else {
                followCount++;
            }
        } else {
            followCount++
        }

        if(urlpattern.test(links[i].attribs.href)) {
            count++;
            correctURL.push(links[i].attribs.href);
        }
    }

    return {
        data: correctURL,
        count: count,
        allLinks: allLinks,
        followCount: followCount,
        noFollowCount: noFollowCount
    }
}

var getAllLinks = function(el) {
    var links = $("a");
    return links;
}

var getExternalLinks = function(el, str) {
    // str = str;
    var links = checkProperLinksCount(el);
    var link = '';

    var externalCount = 0;

    var internaLinksCount = 0;
    var linksData = links.data;
    for(var i = 0 ; i < linksData.length; i++) {
        link = (linksData[i]).replace(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/igm, '$4');
        // url = url.replace(/^((http)s?:\/\/)?(www\.)?(.+?)(\/.+)/ig, '$4');
        ///^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/igm
        if(link) {
            if(link!==str) {
                externalCount++;
            }/* else {
             internaLinksCount++;
             }*/
        }
    }
    // url = url.replace(/^((http)s?:\/\/)?(www\./)?/ig, '');

    return {
        count: links.data.length,
        follow: links.followCount,
        noFollow: links.noFollowCount,
        external: externalCount,
        allLinks: links.allLinks
    };
}

var checkURL = function(url) {
    var valid = /^(ftp|http|https):\/\/[^ "]+$/.test(url);
    return valid;
}


/*End score functions*/

/*Design functions*/
var designScoreCount = function(data, allDom) {
    var problematicData = [];
    var good = 0;
    var bad = 0;
    var perfect = 0;
    var protectClass = 0;
    var swfClass = 0;
    var frameClass = 0;
    var contetntSecureClass = 0;
    var commentClass = 0;
    var doctypeClass = 0;
    var charsetClass = 0;
    var tableClass = 0;
    var emailsClass = 0;
    var contentSecurityPolicy = data.contentSecurityPolicy ? data.contentSecurityPolicy : null;
    var xssProtection = data.xssProtection ? data.xssProtection : null;
    var tables = checkTables(allDom).length;
    var comments = findComments(allDom);
    var commentLength = comments.length ? comments.length : 0;
    var getFrames = getFrame(allDom);
    var swfs = findSWF(allDom);
    var doctype = data.result.toLowerCase().match(/<(\/?|\!?)(doctype html|html|head|body)>/)[0];
    var headerInfo = getHeadInfo(doctype);
    var emails = findEmail(data.result);
    if (emails) {
        emailsClass = 0;
    }

    if(contentSecurityPolicy !=  null) {
        bad++;
        contetntSecureClass = 2;
        problematicData.push('Problem with content Security Policy');
    } else {
        perfect++;
        contetntSecureClass = 0;
    }

    if (xssProtection) {
        perfect++;
        protectClass = 0;
    } else {
        bad++;
        protectClass = 2;
        problematicData.push('Problem with xss protection');
    }

    if(swfs.length > 0) {
        bad++;
        swfClass = 2;
        problematicData.push('Problem with swfs');
    } else {
        perfect++;
        swfClass = 0;
    }

    if (getFrames.length > 0) {
        bad++;
        frameClass = 2;
        problematicData.push('Problem with frames');
    } else {
        perfect++;
        frameClass = 0;
    }

    if (commentLength > 0) {
        good++;
        commentClass = 1;
        problematicData.push('Problem with comment data');
    } else {
        perfect++;
        commentClass = 0;
    }

    if (headerInfo.result == 1) {
        good++;
        doctypeClass = 1;
        problematicData.push('Problem with header info');
    } else if(headerInfo.result == 0) {
        perfect++;
        doctypeClass = 0;
    }  else {
        bad++;
        doctypeClass = 2;
        problematicData.push('Problem with header info');
    }

    if (data.content) {
        perfect++;
        charsetClass = 0;
    } else {
        good++;
        charsetClass = 1;
        problematicData.push('Problem with charset data');
    }

    if (tables > 0) {
        bad++;
        tableClass = 2;
        problematicData.push('Problem with tables');
    } else {
        perfect++;
        tableClass = 0;
    }

    return {
        protectClass : protectClass,
        swfClass : swfClass,
        frameClass : frameClass,
        contetntSecureClass : contetntSecureClass,
        commentClass : commentClass,
        doctypeClass : doctypeClass,
        charsetClass : charsetClass,
        tableClass : tableClass,
        emailsClass: emailsClass,
        headerInfo : headerInfo,
        tables: tables.length,
        getFrames: getFrames,
        emails: emails,
        comments: comments,
        swfs: swfs,
        validDesign: Utils.percent(perfect, 9),
        problematicData: problematicData,
        score: {
            good: good,
            bad: bad,
            perfect: perfect
        }
    }
}

var getHeadInfo = function(html) {
    var str = '';
    var result = 2;
    var strStrong_4 = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
    var strStrongPassing_4 = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">';
    var allFrame_4 = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">';
    var html_5 = "<!DOCTYPE html>";
    var XHTMLStrong_1_0 = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';
    var XHTMLStrongPass_1_0 = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
    var XHTMLStrongPassFrames_1_0 = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">';
    var XHTML_1_1 = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">';

    if (html == strStrong_4.toLocaleLowerCase() || html == strStrongPassing_4.toLocaleLowerCase() || html == allFrame_4.toLocaleLowerCase()) {
        str = 'HTML 4.01';
        result = 1;
    } else if (html == html_5.toLocaleLowerCase()) {
        str = 'HTML 5';
        result = 0;
    } else if (html == XHTMLStrong_1_0.toLocaleLowerCase() || html == XHTMLStrongPass_1_0.toLocaleLowerCase() || html == XHTMLStrongPassFrames_1_0.toLocaleLowerCase()) {
        str = 'XHTML 1.0';
        result = 1;
    } else if (html == XHTML_1_1.toLocaleLowerCase()) {
        str = 'XHTML 1.1';
        result = 1;
    } else {
        str = 'HTML 3.x or less ';
        result = 2;
    }

    return {
        html: html,
        str: str,
        result: result
    };
}
//TODO create function for getting tags
var findSWF = function(el) {
    var allSwf = [];
    var getTags = $("[src$='.swf']");
    for (var i = 0; i < getTags.length; i++) {
        var currentTag = getTags[i].attribs.src;
        allSwf.push();
    }
    return allSwf;
}

var getFrame = function(el) {
    var frame = $('frame').length;
    var iframe = $('iframe').length;
    var frameset = $('frameset').length;

    return {
        frame : frame,
        iframe : iframe,
        frameset : frameset,
        length : frame + iframe + frameset
    }
}

var generateComments = function(el) {
    var arr = [];
    for(var i = 0; i < el.children().length; i++) {
        var node = el.children()[i];
        if(node.nodeType === 8) {
            arr.push(node);
        } else {
            arr.push.apply(arr, generateComments(node));
        }
    }
    return arr;
}

var findComments = function(el) {
    var arr = [];
    for (var i = 0; i < el.contents(); i++ ) {
        var node = el.contents()[i];
        if (node.nodeType == 8) {
            arr.push(node.data);
        }
    }
    return arr;
};

var checkTables = function(el) {
    var tabels = $('table');
    return tabels;
}


/* End Design functions*/

module.exports = router;