export class PayrollHelper {
  /**
   * Calculates all salary components based on monthly wage and rules.
   */
  static calculateComponents(
    monthlyWage: number,
    rules: {
      basicPercentage: number;
      hraPercentageOfBasic: number;
      standardAllowance: number;
      performanceBonusPercentageOfBasic: number;
      ltaPercentageOfBasic: number;
      pfRate: number;
      professionalTax: number;
    }
  ) {
    const basicAmount = (monthlyWage * rules.basicPercentage) / 100;
    const hraAmount = (basicAmount * rules.hraPercentageOfBasic) / 100;
    const performanceBonusAmount =
      (basicAmount * rules.performanceBonusPercentageOfBasic) / 100;
    const ltaAmount = (basicAmount * rules.ltaPercentageOfBasic) / 100;

    // Fixed allowance is the remainder
    const initialSum =
      basicAmount +
      hraAmount +
      rules.standardAllowance +
      performanceBonusAmount +
      ltaAmount;
    const fixedAllowance = monthlyWage - initialSum;

    // PF is calculated on Basic
    const pfEmployee = (basicAmount * rules.pfRate) / 100;
    const pfEmployer = (basicAmount * rules.pfRate) / 100;

    return {
      monthlyWage,
      yearlyWage: monthlyWage * 12,
      basic: {
        percentage: rules.basicPercentage,
        amount: basicAmount,
      },
      hra: {
        percentageOfBasic: rules.hraPercentageOfBasic,
        amount: hraAmount,
      },
      standardAllowance: rules.standardAllowance,
      performanceBonus: {
        percentageOfBasic: rules.performanceBonusPercentageOfBasic,
        amount: performanceBonusAmount,
      },
      lta: {
        percentageOfBasic: rules.ltaPercentageOfBasic,
        amount: ltaAmount,
      },
      fixedAllowance: fixedAllowance < 0 ? 0 : fixedAllowance,
      pf: {
        rate: rules.pfRate,
        employeeContribution: pfEmployee,
        employerContribution: pfEmployer,
      },
      professionalTax: rules.professionalTax,
    };
  }

  /**
   * Calculates the number of days in a given month and year.
   */
  static getDaysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }

  /**
   * Checks if a given day of the week (0-6) is a working day.
   * Assuming 5 days = Mon-Fri (1-5), 6 days = Mon-Sat (1-6), 7 days = All (0-6)
   */
  static isWorkingDay(date: Date, workingDaysPerWeek: number): boolean {
    const day = date.getDay(); // 0 (Sun) to 6 (Sat)
    if (workingDaysPerWeek === 7) return true;
    if (workingDaysPerWeek === 6) return day !== 0; // Mon-Sat
    if (workingDaysPerWeek === 5) return day !== 0 && day !== 6; // Mon-Fri
    // Default to at least the count starting from Monday
    return day >= 1 && day <= workingDaysPerWeek;
  }
}
