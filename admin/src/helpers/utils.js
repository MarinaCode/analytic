/**
 * Created by Marina on 03.02.2017.
 */
var utils = {
    extend : function(ChildClass, ParentClass) {
        ChildClass.prototype = new ParentClass();
        ChildClass.prototype.constructor = ChildClass;
    },
    pagination : function(req,data){
        var thisPage;
        if(req.params.page != undefined && req.params.page != 1){
            thisPage=req.params.page;
        }else{
            thisPage=1;
        }
        var total = data.total;
        var perpage = data.limit ;
        var skip = data.skip;
        var offset=skip + perpage;
        if(offset >total){
            offset=total;
        }
        var pageCount = Math.ceil(total/perpage);
        var elemCount =(skip+1)+perpage;
        if(elemCount > total){
            elemCount = total;
        }
        var elemCount =(skip+1)+perpage;
        return {
            lentgh:total,
            perpage:perpage,
            offset:offset,
            skip:skip+1,
            thisPage:thisPage,
            elemCount:elemCount,
            pages:pageCount
        }
    }
};
module.exports  = utils;