var isRealString = (str) => {
  // console.log('str: ', typeof str, str);
  return typeof str === 'string' && str.trim().length > 0;
};


module.exports = {isRealString};
