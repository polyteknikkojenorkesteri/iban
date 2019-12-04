import {expect} from 'chai';
import {Iban} from './index';

describe('Iban', () => {
  describe('valueOf', () => {
    it('should strip whitespaces', () => {
      const iban = Iban.valueOf({iban: 'FI64 5687 6285 8198 43', bic: 'OKOYFIHH', bankName: 'OP'});
      expect(iban.iban).to.eq('FI6456876285819843');
    });

    it('should accept a string value', () => {
      const iban = Iban.valueOf('FI6456876285819843');
      expect(iban.iban).to.eq('FI6456876285819843');
    });
  });

  describe('bic', () => {
    it('should be optional', () => {
      const iban = Iban.valueOf({iban: 'FI6456876285819843', bankName: 'OP'});
      expect(iban.bic).to.eq(undefined);
    });

    it('should accept a valid value', () => {
      const iban = Iban.valueOf({iban: 'FI6456876285819843', bic: 'OKOYFIHH', bankName: 'OP'});
      expect(iban.bic).to.eq('OKOYFIHH');
    });
  });

  describe('bank name', () => {
    it('should be optional', () => {
      const iban = Iban.valueOf({iban: 'FI6456876285819843', bic: 'OKOYFIHH'});
      expect(iban.bankName).to.eq(undefined);
    });

    it('should accept a valid value', () => {
      const iban = Iban.valueOf({iban: 'FI6456876285819843', bic: 'OKOYFIHH', bankName: 'OP'});
      expect(iban.bankName).to.eq('OP');
    });
  });

  describe('formatIban', () => {
    it('should print chars in groups of 4', () => {
      const iban = Iban.valueOf({iban: 'FI6456876285819843', bic: 'OKOYFIHH', bankName: 'OP'});
      expect(iban.formatIban()).to.eq('FI64\xA05687\xA06285\xA08198\xA043');
    });
  });

  describe('toJSON', () => {
    const iban = Iban.valueOf({iban: 'FI6456876285819843', bic: 'OKOYFIHH', bankName: 'OP'});

    it('should return an object with correct iban', () => {
      expect(iban.toJSON().iban).to.eq('FI6456876285819843');
    });

    it('should return an object with correct bic', () => {
      expect(iban.toJSON().bic).to.eq('OKOYFIHH');
    });

    it('should return an object with correct bank name', () => {
      expect(iban.toJSON().bankName).to.eq('OP');
    });
  });

  describe('toString', () => {
    it('should return a formatted IBAN string', () => {
      const iban = Iban.valueOf({iban: 'FI6456876285819843', bic: 'OKOYFIHH', bankName: 'OP'});
      expect(iban.toString()).to.eq('FI64 5687 6285 8198 43');
    });
  });

  describe('equals', () => {
    const iban = Iban.valueOf({iban: 'FI6456876285819843', bic: 'OKOYFIHH', bankName: 'OP'});

    it('should return false if another is undefined', () => {
      expect(iban.equals(undefined)).to.eq(false);
    });

    it('should return false if another is null', () => {
      expect(iban.equals(null)).to.eq(false);
    });

    it('should return false if another is invalid iban', () => {
      expect(iban.equals('')).to.eq(false);
    });

    it('should return true if iban, bic and bank name are equal', () => {
      const another = {iban: 'FI6456876285819843', bic: 'OKOYFIHH', bankName: 'OP'};
      expect(iban.equals(another)).to.eq(true);
    });

    it('should return true if another is instance of Iban', () => {
      const another = Iban.valueOf({iban: 'FI6456876285819843', bic: 'OKOYFIHH', bankName: 'OP'});
      expect(iban.equals(another)).to.eq(true);
    });

    it('should return false if iban is not equal', () => {
      const another = Iban.valueOf({iban: 'FI4452768438522348', bic: 'OKOYFIHH', bankName: 'OP'});
      expect(iban.equals(another)).to.eq(false);
    });

    it('should return false if bic is not equal', () => {
      const another = Iban.valueOf({iban: 'FI6456876285819843', bic: 'OBOYFIHH', bankName: 'OP'});
      expect(iban.equals(another)).to.eq(false);
    });

    it('should return false if bank name is not equal', () => {
      const another = Iban.valueOf({iban: 'FI6456876285819843', bic: 'OKOYFIHH', bankName: 'Op'});
      expect(iban.equals(another)).to.eq(false);
    });

    it('should return true if bic and bank name are undefined', () => {
      expect(Iban.valueOf('FI6456876285819843').equals({iban: 'FI6456876285819843'}))
        .to.eq(true);
    });

    it('should return false if another is string', () => {
      expect(Iban.valueOf('FI6456876285819843').equals('FI6456876285819843'))
        .to.eq(false);
    });

    it('should return true if another is formatted', () => {
      expect(Iban.valueOf('FI6456876285819843').equals({iban: 'FI64 5687 6285 8198 43'}))
        .to.eq(true);
    });
  });
});
