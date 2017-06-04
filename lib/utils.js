var currency_symbols = {
    'USD': '$', // US Dollar
    'EUR': '€', // Euro
    'CRC': '₡', // Costa Rican Colón
    'GBP': '£', // British Pound Sterling
    'ILS': '₪', // Israeli New Sheqel
    'INR': '₹', // Indian Rupee
    'JPY': '¥', // Japanese Yen
    'KRW': '₩', // South Korean Won
    'NGN': '₦', // Nigerian Naira
    'PHP': '₱', // Philippine Peso
    'PLN': 'zł', // Polish Zloty
    'PYG': '₲', // Paraguayan Guarani
    'THB': '฿', // Thai Baht
    'UAH': '₴', // Ukrainian Hryvnia
    'VND': '₫', // Vietnamese Dong
};

exports.getCurrencySymbol = function(currencyName) {
	if(currency_symbols[currencyName]!==undefined) {
	    return currency_symbols[currencyName];
	}
	return '';
};

exports.log = function(context, msg) {
   console.log(context + ": " + msg);
};

exports.error = function(context, msg) {
   console.log(context + ": ERROR: " + msg);
};

exports.warn = function(context, msg) {
   console.log(context + ": WARN: " + msg);
};

exports.trace = function(context, msg) {
   console.log(context + ": " + msg);
};


