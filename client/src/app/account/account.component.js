"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var utils_1 = require("../utils/utils");
var AccountComponent = (function () {
    function AccountComponent(indexService, route, fb) {
        this.indexService = indexService;
        this.route = route;
        this.fb = fb;
        this.disabled = false;
        this.country = [
            { value: 'AF', display: 'Afghanistan' },
            { value: 'AL', display: 'Albania' },
            { value: 'DZ', display: 'Algeria' },
            { value: 'AS', display: 'American Samoa' },
            { value: 'AD', display: 'Andorra' },
            { value: 'AO', display: 'Angola' },
            { value: 'AI', display: 'Anguilla' },
            { value: 'AQ', display: 'Antarctica' },
            { value: 'AG', display: 'Antigua and Barbuda' },
            { value: 'AR', display: 'Argentina' },
            { value: 'AM', display: 'Armenia' },
            { value: 'AW', display: 'Aruba' },
            { value: 'AU', display: 'Australia' },
            { value: 'AT', display: 'Austria' },
            { value: 'AZ', display: 'Azerbaijan' },
            { value: 'BS', display: 'Bahamas' },
            { value: 'BH', display: 'Bahrain' },
            { value: 'BD', display: 'Bangladesh' },
            { value: 'BB', display: 'Barbados' },
            { value: 'BY', display: 'Belarus' },
            { value: 'BE', display: 'Belgium' },
            { value: 'BZ', display: 'Belize' },
            { value: 'BJ', display: 'Benin' },
            { value: 'BM', display: 'Bermuda' },
            { value: 'BT', display: 'Bhutan' },
            { value: 'BO', display: 'Bolivia, Plurinational State of' },
            { value: 'BQ', display: 'Bonaire, Sint Eustatius and Saba' },
            { value: 'BA', display: 'Bosnia and Herzegovina' },
            { value: 'BW', display: 'Botswana' },
            { value: 'BV', display: 'Bouvet Island' },
            { value: 'BR', display: 'Brazil' },
            { value: 'IO', display: 'British Indian Ocean Territory' },
            { value: 'BN', display: 'Brunei Darussalam' },
            { value: 'BG', display: 'Bulgaria' },
            { value: 'BF', display: 'Burkina Faso' },
            { value: 'BI', display: 'Burundi' },
            { value: 'KH', display: 'Cambodia' },
            { value: 'CM', display: 'Cameroon' },
            { value: 'CA', display: 'Canada' },
            { value: 'CV', display: 'Cape Verde' },
            { value: 'KY', display: 'Cayman Islands' },
            { value: 'CF', display: 'Central African Republic' },
            { value: 'TD', display: 'Chad' },
            { value: 'CL', display: 'Chile' },
            { value: 'CN', display: 'China' },
            { value: 'CX', display: 'Christmas Island' },
            { value: 'CC', display: 'Cocos (Keeling) Islands' },
            { value: 'CO', display: 'Colombia' },
            { value: 'KM', display: 'Comoros' },
            { value: 'CG', display: 'Congo' },
            { value: 'CD', display: 'Congo, the Democratic Republic of the' },
            { value: 'CK', display: 'Cook Islands' },
            { value: 'CR', display: 'CUSTOM' },
            { value: 'CI', display: 'Cuba' },
            { value: 'CU', display: 'Croatia' },
            { value: 'CW', display: 'CuraÃ§ao' },
            { value: 'CY', display: 'Cyprus' },
            { value: 'CZ', display: 'Czech Republic' },
            { value: 'DK', display: 'Denmark' },
            { value: 'DJ', display: 'Djibouti' },
            { value: 'DM', display: 'Dominica' },
            { value: 'DO', display: 'Dominican Republic' },
            { value: 'EC', display: 'Ecuador' },
            { value: 'EG', display: 'Egypt' },
            { value: 'SV', display: 'El Salvador' },
            { value: 'GQ', display: 'Equatorial Guinea' },
            { value: 'ER', display: 'Eritrea' },
            { value: 'EE', display: 'Estonia' },
            { value: 'ET', display: 'Ethiopia' },
            { value: 'FK', display: 'Falkland Islands (Malvinas)' },
            { value: 'FO', display: 'Faroe Islands' },
            { value: 'FJ', display: 'Fiji' },
            { value: 'FI', display: 'Finland' },
            { value: 'FR', display: 'France' },
            { value: 'GF', display: 'French Guiana' },
            { value: 'PF', display: 'French Polynesia' },
            { value: 'TF', display: 'French Southern Territories' },
            { value: 'GA', display: 'Gabon' },
            { value: 'GM', display: 'Gambia' },
            { value: 'GE', display: 'Georgia' },
            { value: 'DE', display: 'Germany' },
            { value: 'GH', display: 'Ghana' },
            { value: 'GI', display: 'Gibraltar' },
            { value: 'GR', display: 'Greece' },
            { value: 'GL', display: 'Greenland' },
            { value: 'GD', display: 'Grenada' },
            { value: 'GP', display: 'Guadeloupe' },
            { value: 'GU', display: 'Guam' },
            { value: 'GT', display: 'Guatemala' },
            { value: 'GG', display: 'Guernsey' },
            { value: 'GN', display: 'Guinea' },
            { value: 'GW', display: 'Guinea-Bissau' },
            { value: 'GY', display: 'Guyana' },
            { value: 'HT', display: 'Haiti' },
            { value: 'HM', display: 'Heard Island and McDonald Islands' },
            { value: 'VA', display: 'Holy See (Vatican City State)' },
            { value: 'HN', display: 'Honduras' },
            { value: 'HK', display: 'Hong Kong' },
            { value: 'HU', display: 'Hungary' },
            { value: 'IS', display: 'Iceland' },
            { value: 'IN', display: 'India' },
            { value: 'ID', display: 'Indonesia' },
            { value: 'IR', display: 'Iran, Islamic Republic of' },
            { value: 'IQ', display: 'Iraq' },
            { value: 'IE', display: 'Ireland' },
            { value: 'IM', display: 'Isle of Man' },
            { value: 'IL', display: 'Israel' },
            { value: 'IT', display: 'Italy' },
            { value: 'JM', display: 'Jamaica' },
            { value: 'JP', display: 'Japan' },
            { value: 'JE', display: 'Jersey' },
            { value: 'JO', display: 'Jordan' },
            { value: 'KZ', display: 'Kazakhstan' },
            { value: 'KE', display: 'Kenya' },
            { value: 'KI', display: 'Kiribati' },
            { value: 'KP', display: 'KP' },
            { value: 'KR', display: 'Korea, Republic of' },
            { value: 'KW', display: 'Kyrgyzstan' },
            { value: 'KG', display: 'Kyrgyzstan' },
            { value: 'LA', display: 'LA' },
            { value: 'LV', display: 'Latvia' },
            { value: 'LB', display: 'Lebanon' },
            { value: 'LS', display: 'Lesotho' },
            { value: 'LR', display: 'Liberia' },
            { value: 'LY', display: 'Libya' },
            { value: 'LI', display: 'Liechtenstein' },
            { value: 'LT', display: 'Lithuania' },
            { value: 'LU', display: 'Luxembourg' },
            { value: 'MO', display: 'Macao' },
            { value: 'MK', display: 'MK' },
            { value: 'MG', display: 'Madagascar' },
            { value: 'MW', display: 'Malawi' },
            { value: 'MY', display: 'Malaysia' },
            { value: 'MV', display: 'Maldives' },
            { value: 'ML', display: 'Mali' },
            { value: 'MT', display: 'Malta' },
            { value: 'MH', display: '>Marshall Islands' },
            { value: 'MQ', display: 'Martinique' },
            { value: 'MR', display: 'Mauritania' },
            { value: 'MU', display: 'Mauritius' },
            { value: 'YT', display: 'Mayotte' },
            { value: 'MX', display: 'Mexico' },
            { value: 'FM', display: 'FM' },
            { value: 'MD', display: 'MD' },
            { value: 'MC', display: 'Monaco' },
            { value: 'MN', display: 'Mongolia' },
            { value: 'ME', display: 'Montenegro' },
            { value: 'MS', display: 'Montserrat' },
            { value: 'MA', display: 'Morocco' },
            { value: 'MZ', display: 'Mozambique' },
            { value: 'MM', display: 'Myanmar' },
            { value: 'NA', display: 'Namibia' },
            { value: 'NR', display: 'Nauru' },
            { value: 'NP', display: 'Nepal' },
            { value: 'NL', display: 'Netherlands' },
            { value: 'NC', display: 'New Caledonia' },
            { value: 'NZ', display: 'New Zealand' },
            { value: 'NI', display: 'Nicaragua' },
            { value: 'NE', display: 'Niger' },
            { value: 'NG', display: 'Nigeria' },
            { value: 'NU', display: 'Niue' },
            { value: 'NF', display: 'Norfolk Island' },
            { value: 'MP', display: 'Northern Mariana Islands' },
            { value: 'NO', display: 'Norway' },
            { value: 'OM', display: 'Oman' },
            { value: 'PK', display: 'Pakistan' },
            { value: 'PW', display: 'Palau' },
            { value: 'PS', display: 'Palestinian Territory, Occupied' },
            { value: 'PA', display: 'Panama' },
            { value: 'PG', display: 'Papua New Guinea' },
            { value: 'PY', display: 'Paraguay' },
            { value: 'PE', display: 'Peru' },
            { value: 'PH', display: 'Philippines' },
            { value: 'PN', display: 'Pitcairn' },
            { value: 'PL', display: 'Poland' },
            { value: 'PT', display: 'Portugal' },
            { value: 'PR', display: 'Puerto Rico' },
            { value: 'QA', display: 'Qatar' },
            { value: 'RE', display: 'RÃ©union' },
            { value: 'RO', display: 'Romania' },
            { value: 'RU', display: 'Russian Federation' },
            { value: 'RW', display: 'Rwanda' },
            { value: 'BL', display: 'Saint BarthÃ©lemy' },
            { value: 'SH', display: 'Saint Helena, Ascension and Tristan da Cunha' },
            { value: 'KN', display: 'Saint Kitts and Nevis' },
            { value: 'LC', display: 'Saint Lucia' },
            { value: 'MF', display: 'Saint Martin (French part)' },
            { value: 'PM', display: 'Saint Pierre and Miquelon' },
            { value: 'VC', display: 'Saint Vincent and the Grenadines' },
            { value: 'WS', display: 'Samoa' },
            { value: 'SM', display: 'San Marino' },
            { value: 'ST', display: 'Sao Tome and Principe' },
            { value: 'SA', display: 'Saudi Arabia' },
            { value: 'SN', display: 'Senegal' },
            { value: 'RS', display: 'Serbia' },
            { value: 'SC', display: 'Seychelles' },
            { value: 'SL', display: 'Sierra Leone' },
            { value: 'SG', display: 'Singapore' },
            { value: 'SX', display: 'Sint Maarten (Dutch part)' },
            { value: 'SK', display: 'Slovakia' },
            { value: 'SI', display: 'Slovenia' },
            { value: 'SB', display: 'Solomon Islands' },
            { value: 'SO', display: 'Somalia' },
            { value: 'ZA', display: 'South Africa' },
            { value: 'GS', display: 'South Georgia and the South Sandwich Islands' },
            { value: 'SS', display: 'South Sudan' },
            { value: 'ES', display: 'Spain' },
            { value: 'LK', display: 'Sri Lanka' },
            { value: 'SD', display: 'Sudan' },
            { value: 'SR', display: 'Suriname' },
            { value: 'SJ', display: 'Svalbard and Jan Mayen' },
            { value: 'SZ', display: 'Swaziland' },
            { value: 'SE', display: 'Sweden' },
            { value: 'CH', display: 'Switzerland' },
            { value: 'SY', display: 'Syrian Arab Republic' },
            { value: 'TW', display: 'Taiwan, Province of China' },
            { value: 'TJ', display: 'Tajikistan' },
            { value: 'TZ', display: 'Tanzania, United Republic of' },
            { value: 'TH', display: 'Thailand' },
            { value: 'TL', display: 'Timor-Lest' },
            { value: 'TG', display: 'Togo' },
            { value: 'TK', display: 'Tokelau' },
            { value: 'TO', display: 'Tonga' },
            { value: 'TT', display: 'Trinidad and Tobago' },
            { value: 'TN', display: 'Tunisia' },
            { value: 'TR', display: 'Turkey' },
            { value: 'TM', display: 'Turkmenistan' },
            { value: 'TC', display: 'Turks and Caicos Islands' },
            { value: 'TV', display: 'Tuvalu' },
            { value: 'UG', display: 'Uganda' },
            { value: 'UA', display: 'Ukraine' },
            { value: 'AE', display: 'United Arab Emirates' },
            { value: 'GB', display: 'United Kingdom' },
            { value: 'US', display: 'United States' },
            { value: 'UM', display: 'United States Minor Outlying Islands' },
            { value: 'UY', display: 'Uruguay' },
            { value: 'UZ', display: 'Uzbekistan' },
            { value: 'VU', display: 'Vanuatu' },
            { value: 'VE', display: 'Venezuela, Bolivarian Republic of' },
            { value: 'VN', display: 'Viet Nam' },
            { value: 'VG', display: 'Virgin Islands, British' },
            { value: 'VI', display: 'Virgin Islands, U.S.' },
            { value: 'WF', display: 'Wallis and Futuna' },
            { value: 'EH', display: 'Western Sahara' },
            { value: 'YE', display: 'Yemen' },
            { value: 'ZM', display: 'Zambia' },
            { value: 'ZW', display: 'Zimbabwe' }
        ];
        this.month = [
            { value: '1', display: 'January' },
            { value: '2', display: 'Feb' },
            { value: '3', display: 'Mar' },
            { value: '4', display: 'Apr' },
            { value: '5', display: 'May' },
            { value: '6', display: 'Jun' },
            { value: '7', display: 'Jul' },
            { value: '8', display: 'Aug' },
            { value: '9', display: 'Sep' },
            { value: '10', display: 'Oct' },
            { value: '11', display: 'Nov' },
            { value: '12', display: 'Dec' }
        ];
        this.day = [
            { value: '1', display: '1' },
            { value: '2', display: '2' },
            { value: '3', display: '3' },
            { value: '4', display: '4' },
            { value: '5', display: '5' },
            { value: '6', display: '6' },
            { value: '7', display: '7' },
            { value: '8', display: '8' },
            { value: '9', display: '9' },
            { value: '10', display: '10' },
            { value: '11', display: '11' },
            { value: '12', display: '12' },
            { value: '13', display: '13' },
            { value: '14', display: '14' },
            { value: '15', display: '15' },
            { value: '16', display: '16' },
            { value: '17', display: '17' },
            { value: '18', display: '18' },
            { value: '19', display: '19' },
            { value: '20', display: '20' },
            { value: '21', display: '21' },
            { value: '22', display: '22' },
            { value: '23', display: '23' },
            { value: '24', display: '24' },
            { value: '25', display: '25' },
            { value: '26', display: '26' },
            { value: '27', display: '27' },
            { value: '28', display: '28' },
            { value: '29', display: '29' },
            { value: '30', display: '30' },
            { value: '31', display: '31' }
        ];
        this.year = [
            { value: '2016', display: '2016' },
            { value: '2015', display: '2015' },
            { value: '2014', display: '2014' },
            { value: '2013', display: '2013' },
            { value: '2012', display: '2012' },
            { value: '2011', display: '2011' },
            { value: '2010', display: '2010' },
            { value: '2009', display: '2009' },
            { value: '2008', display: '2008' },
            { value: '2007', display: '2007' },
            { value: '2006', display: '2006' },
            { value: '2005', display: '2005' },
            { value: '2004', display: '2004' },
            { value: '2003', display: '2003' },
            { value: '2002', display: '2002' },
            { value: '2001', display: '2001' },
            { value: '2000', display: '2000' },
            { value: '1999', display: '1999' },
            { value: '1998', display: '1998' },
            { value: '1997', display: '1997' },
            { value: '1996', display: '1996' },
            { value: '1995', display: '1995' },
            { value: '1994', display: '1994' },
            { value: '1993', display: '1993' },
            { value: '1992', display: '1992' },
            { value: '1991', display: '1991' },
            { value: '1990', display: '1990' },
            { value: '1989', display: '1989' },
            { value: '1988', display: '1988' },
            { value: '1987', display: '1987' },
            { value: '1986', display: '1986' },
            { value: '1985', display: '1985' },
            { value: '1984', display: '1984' },
            { value: '1983', display: '1983' },
            { value: '1982', display: '1982' },
            { value: '1981', display: '1981' },
            { value: '1980', display: '1980' },
            { value: '1979', display: '1979' },
            { value: '1978', display: '1978' },
            { value: '1977', display: '1977' },
            { value: '1976', display: '1976' },
            { value: '1975', display: '1975' },
            { value: '1974', display: '1974' },
            { value: '1973', display: '1973' },
            { value: '1972', display: '1972' },
            { value: '1971', display: '1971' },
            { value: '1970', display: '1970' },
            { value: '1969', display: '1969' },
            { value: '1968', display: '1968' },
            { value: '1967', display: '1967' },
            { value: '1966', display: '1966' },
            { value: '1965', display: '1965' },
            { value: '1964', display: '1964' },
            { value: '1963', display: '1963' },
            { value: '1962', display: '1962' },
            { value: '1961', display: '1961' },
            { value: '1960', display: '1960' },
            { value: '1959', display: '1959' },
            { value: '1958', display: '1958' },
            { value: '1957', display: '1957' },
            { value: '1956', display: '1956' },
            { value: '1955', display: '1955' },
            { value: '1954', display: '1954' },
            { value: '1953', display: '1953' },
            { value: '1952', display: '1952' },
            { value: '1951', display: '1951' },
            { value: '1950', display: '1950' },
            { value: '1949', display: '1949' },
            { value: '1948', display: '1948' },
            { value: '1947', display: '1947' },
            { value: '1946', display: '1946' },
            { value: '1945', display: '1945' },
            { value: '1944', display: '1944' },
            { value: '1943', display: '1943' },
            { value: '1942', display: '1942' },
            { value: '1941', display: '1941' },
            { value: '1940', display: '1940' },
            { value: '1939', display: '1939' },
            { value: '1938', display: '1938' },
            { value: '1937', display: '1937' },
            { value: '1936', display: '1936' },
            { value: '1935', display: '1935' },
            { value: '1934', display: '1934' },
            { value: '1933', display: '1933' },
            { value: '1932', display: '1932' },
            { value: '1931', display: '1931' },
            { value: '1930', display: '1930' },
            { value: '1929', display: '1929' },
            { value: '1928', display: '1928' },
            { value: '1927', display: '1927' },
            { value: '1926', display: '1926' },
            { value: '1925', display: '1925' },
            { value: '1924', display: '1924' },
            { value: '1923', display: '1923' },
            { value: '1922', display: '1922' },
            { value: '1921', display: '1921' },
            { value: '1920', display: '1920' },
            { value: '1919', display: '1919' },
            { value: '1918', display: '1918' },
            { value: '1917', display: '1917' },
            { value: '1916', display: '1916' },
            { value: '1915', display: '1915' },
            { value: '1914', display: '1914' },
            { value: '1913', display: '1913' },
            { value: '1912', display: '1912' },
            { value: '1911', display: '1911' },
            { value: '1910', display: '1910' },
            { value: '1909', display: '1909' },
            { value: '1908', display: '1908' },
            { value: '1907', display: '1907' },
            { value: '1906', display: '1906' },
            { value: '1905', display: '1905' },
        ];
        this.image = "";
        this.form = this.fb.group({
            first_name: ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.maxLength(10)])],
            last_name: ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.maxLength(10)])],
            email: ['', forms_1.Validators.compose([forms_1.Validators.required, this.emailValidator])],
            gender: '2',
            username: ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.maxLength(10)])],
            country: [this.country],
            company: '',
            profession: '',
            day: [this.day],
            month: [this.month],
            year: '',
            current: [null, forms_1.Validators.minLength(8)],
            pass: [null, forms_1.Validators.minLength(8)],
            confirm: [null, forms_1.Validators.minLength(8)],
            phone: '',
            emailType: null
        });
        this.indexService.progress$.subscribe(function (data) {
            console.log('progress = ' + data);
        });
    }
    AccountComponent.prototype.renderImage = function (file) {
        var _this = this;
        var reader = new FileReader();
        reader.onload = function (event) {
            var the_url = event.target.result;
            _this.image_block.nativeElement.setAttribute('src', the_url);
        };
        reader.readAsDataURL(file);
    };
    AccountComponent.prototype.changeImage = function (event) {
        var files = event.srcElement.files;
        this.files = files;
        this.renderImage(files[0]);
        this.indexService.makeFileRequest('http://localhost:3000/analytic/api/v1/users/updateImage', this.form.value, this.files).subscribe(function (data) {
            var error = data.error;
            if (error) {
            }
        });
    };
    AccountComponent.prototype.emailValidator = function (control) {
        var emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (control.value && !emailRegexp.test(control.value)) {
            return { invalidEmail: true };
        }
    };
    AccountComponent.prototype.updateUserData = function (data) {
        //TODO   loading icon
        // this.saveBtn.nativeElement.innerText = "Processing..."
        var _this = this;
        if (utils_1.Utils.regEmail(data.email) && data.username && data.username.length <= 10) {
            this.indexService.updateUserData(data).subscribe(function (data) {
                if (data.ok) {
                    setTimeout(function () {
                        _this.saveBtn.nativeElement.innerText = "Submited";
                        setTimeout(function () {
                            _this.saveBtn.nativeElement.innerText = "Submit";
                        }, 1000);
                    }, 2000);
                }
            });
        }
    };
    AccountComponent.prototype.updatePassword = function (data) {
        var _this = this;
        if (data.emailType != 1 && data.emailType != 2) {
            var isValidPass = true;
            if (data.current) {
                if (data.current.length < 8) {
                    isValidPass = false;
                    this.form.controls['current'].markAsTouched();
                    this.form.controls['current'].setErrors({
                        valid: false
                    });
                }
                else {
                    if (!data.pass) {
                        isValidPass = false;
                        this.form.controls['pass'].markAsTouched();
                        this.form.controls['pass'].setErrors({
                            valid: false
                        });
                    }
                    if (!data.confirm) {
                        isValidPass = false;
                        this.form.controls['confirm'].markAsTouched();
                        this.form.controls['confirm'].setErrors({
                            valid: false
                        });
                    }
                    if (data.pass !== data.confirm) {
                        isValidPass = false;
                    }
                }
            }
            if (isValidPass) {
                this.indexService.updatePassword(data).subscribe(function (data) {
                    var error = data.error;
                    if (error) {
                        _this.form.controls['current'].markAsTouched();
                        _this.form.controls['current'].setErrors({
                            valid: false
                        });
                    }
                    else {
                        _this.saveBtn.nativeElement.innerText = "Submited";
                        _this.saveBtn.nativeElement.innerText = "Submit";
                    }
                });
            }
        }
    };
    AccountComponent.prototype.submitForm = function (data) {
    };
    AccountComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.indexService.getUserById().subscribe(function (result) {
            var userInfo = result;
            var date = userInfo.birthDate ? new Date(userInfo.birthDate) : null;
            _this.image = userInfo.image;
            _this.form.setValue({
                first_name: userInfo.first_name,
                last_name: userInfo.last_name,
                username: userInfo.username,
                email: userInfo.email,
                gender: userInfo.gender,
                country: userInfo.country,
                company: userInfo.company,
                profession: userInfo.profession,
                day: date ? date.getDate() : null,
                month: date ? date.getMonth() + 1 : null,
                year: date ? date.getFullYear() : null,
                phone: userInfo.phone,
                emailType: userInfo.emailType,
                current: null,
                pass: null,
                confirm: null
            });
        });
    };
    return AccountComponent;
}());
__decorate([
    core_1.ViewChild('image_block')
], AccountComponent.prototype, "image_block", void 0);
__decorate([
    core_1.ViewChild('saveBtn')
], AccountComponent.prototype, "saveBtn", void 0);
AccountComponent = __decorate([
    core_1.Component({
        selector: 'app-settings',
        templateUrl: 'account.component.html',
        styleUrls: ['account.component.css', 'account.component.scss']
    })
], AccountComponent);
exports.AccountComponent = AccountComponent;
