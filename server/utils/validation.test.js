const expect = require('expect');

// import isRealString

// isRealString
  // should reject non-string values (return false)
  // should reject string with only spaces
  // should allow string with non-space characters

  var {isRealString} = require('./validation');

  describe('isRealString', ()=> {
    it('should reject non-string values', () => {
      expect(isRealString(123)).toBe(false);
      // expect(isRealString('123')).toBe(false);
      // expect(isRealString('!@#')).toBe(false);
      expect(isRealString(' ')).toBe(false);
      // expect(isRealString(' ^ ')).toBe(false);
      expect(isRealString(' x ')).toBe(true);
      // expect(isRealString(' x x ')).toBe(true);
      expect(isRealString('x x')).toBe(true);
    });
  });
