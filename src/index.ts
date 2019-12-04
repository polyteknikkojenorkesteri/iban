export class InvalidIbanError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidIbanError'
  }
}

export interface IbanValue {
  iban: string;
  bic?: string;
  bankName?: string;
}

export class Iban implements IbanValue {
  readonly iban: string;
  readonly bic?: string;
  readonly bankName?: string;

  static valueOf(value: IbanValue | string): Iban {
    if (value instanceof Iban) {
      return value;
    } else if (typeof value === 'string') {
      return new Iban({iban: value});
    } else {
      return new Iban(value);
    }
  }

  private constructor(value: IbanValue) {
    if (value.iban === undefined || value.iban === null || value.iban === '') {
      throw new InvalidIbanError(`Invalid IBAN '${value.iban}'`);
    }

    this.iban = Iban.normalizeIban(value.iban);
    this.bic = value.bic;
    this.bankName = value.bankName;
  }

  /**
   * Returns the IBAN in a grouped display format.
   *
   * @param groupSeparator non-breaking space by default
   */
  formatIban(groupSeparator = '\xA0'): string {
    let result = '';

    for (let i = 0; i < this.iban.length; i += 4) {
      if (result !== '') {
        result += groupSeparator;
      }

      result += this.iban.slice(i, i + 4);
    }

    return result;
  }

  toJSON(): IbanValue {
    return {
      iban: this.iban,
      bic: this.bic,
      bankName: this.bankName
    };
  }

  toString(): string {
    return this.formatIban(' ');
  }

  equals(another: any) {
    if (another === undefined || another === null) {
      return false;
    }

    // Compare to a normalized value without formatting
    return typeof another.iban === 'string' &&
      this.iban === Iban.normalizeIban(another.iban) &&
      this.bic === another.bic &&
      this.bankName === another.bankName;
  }

  private static normalizeIban(iban: string): string {
    return iban.replace(/\s/g, '');
  }
}
