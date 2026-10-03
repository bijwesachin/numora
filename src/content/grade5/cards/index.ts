import type { Flashcard } from '@/domain/flashcard';
import { wpRuncCards } from './word-problems/wpRunc';
import { wpAddSubtractCards } from './word-problems/wpAddSubtract';
import { wpMultiplyDivideCards } from './word-problems/wpMultiplyDivide';
import { wpFractionsCards } from './word-problems/wpFractions';
import { wpDecimalsCards } from './word-problems/wpDecimals';
import { wpMoneyCards } from './word-problems/wpMoney';
import { wpElapsedTimeCards } from './word-problems/wpElapsedTime';
import { wpMeasurementCards } from './word-problems/wpMeasurement';
import { wpVolumeCards } from './word-problems/wpVolume';
import { wpTwoStepCards } from './word-problems/wpTwoStep';
import { wpMultiStepCards } from './word-problems/wpMultiStep';
import { wpMissingInfoCards } from './word-problems/wpMissingInfo';
import { wpExtraInfoCards } from './word-problems/wpExtraInfo';
import { mrEstimateFirstCards } from './word-problems/mrEstimateFirst';
import { mrDrawPictureCards } from './word-problems/mrDrawPicture';
import { mrMakeTableCards } from './word-problems/mrMakeTable';
import { mrFindPatternCards } from './word-problems/mrFindPattern';
import { mrWorkBackwardsCards } from './word-problems/mrWorkBackwards';
import { mrEliminateCards } from './word-problems/mrEliminate';
import { mrInverseCheckCards } from './word-problems/mrInverseCheck';
import { mrUnnecessaryInfoCards } from './word-problems/mrUnnecessaryInfo';
import { mrReasonableCards } from './word-problems/mrReasonable';
import { mulEstimationCards } from './operations/mulEstimation';
import { mulAreaModelCards } from './operations/mulAreaModel';
import { mulPartialProductsCards } from './operations/mulPartialProducts';
import { mul2x2Cards } from './operations/mul2x2';
import { mul3x2Cards } from './operations/mul3x2';
import { mulStandardAlgorithmCards } from './operations/mulStandardAlgorithm';
import { mulCheckDivisionCards } from './operations/mulCheckDivision';
import { divMeaningCards } from './operations/divMeaning';
import { divLongDivisionCards } from './operations/divLongDivision';
import { divRemaindersCards } from './operations/divRemainders';
import { div4Digit1DigitCards } from './operations/div4Digit1Digit';
import { divEstimateCards } from './operations/divEstimate';
import { div2DigitDivisorCards } from './operations/div2DigitDivisor';
import { divCheckMultiplicationCards } from './operations/divCheckMultiplication';
import { fmFactorPairsCards } from './operations/fmFactorPairs';
import { fmDivisibilityCards } from './operations/fmDivisibility';
import { fmEvenOddCards } from './operations/fmEvenOdd';
import { fmPrimeCompositeCards } from './operations/fmPrimeComposite';
import { fmPrimeFactorizationCards } from './operations/fmPrimeFactorization';
import { fmCommonFactorsCards } from './operations/fmCommonFactors';
import { fmGcfCards } from './operations/fmGcf';
import { fmMultiplesCards } from './operations/fmMultiples';
import { fmCommonMultiplesCards } from './operations/fmCommonMultiples';
import { fmLcmCards } from './operations/fmLcm';
import { decPlacesCards } from './decimals/decPlaces';
import { decReadWriteCards } from './decimals/decReadWrite';
import { decCompareCards } from './decimals/decCompare';
import { decRoundCards } from './decimals/decRound';
import { decAddCards } from './decimals/decAdd';
import { decSubtractCards } from './decimals/decSubtract';
import { decMultiplyCards } from './decimals/decMultiply';
import { decMultiplySmallerCards } from './decimals/decMultiplySmaller';
import { decDivideCards } from './decimals/decDivide';
import { decPowersOfTenCards } from './decimals/decPowersOfTen';
import { fdBenchmarksCards } from './decimals/fdBenchmarks';
import { fdFractionToDecimalCards } from './decimals/fdFractionToDecimal';
import { fdDecimalToFractionCards } from './decimals/fdDecimalToFraction';
import { exprParenthesesCards } from './algebra/exprParentheses';
import { exprOrderOfOperationsCards } from './algebra/exprOrderOfOperations';
import { exprEvaluateCards } from './algebra/exprEvaluate';
import { exprWordsToMathCards } from './algebra/exprWordsToMath';
import { exprVsEquationCards } from './algebra/exprVsEquation';
import { algNumberPatternsCards } from './algebra/algNumberPatterns';
import { algInputOutputCards } from './algebra/algInputOutput';
import { algTwoRulePatternsCards } from './algebra/algTwoRulePatterns';
import { algVariablesCards } from './algebra/algVariables';
import { algMissingNumbersCards } from './algebra/algMissingNumbers';
import { algEquationsCards } from './algebra/algEquations';
import { timesTableCards } from './times-tables/tables';
import { timesTableStrategyCards } from './times-tables/strategies';
import { intMeaningCards } from './integers/intMeaning';
import { intNumberLineCards } from './integers/intNumberLine';
import { intAbsoluteValueCards } from './integers/intAbsoluteValue';
import { intAddSameCards } from './integers/intAddSame';
import { intAddDifferentCards } from './integers/intAddDifferent';
import { intSubtractCards } from './integers/intSubtract';
import { intMultiplyCards } from './integers/intMultiply';
import { intDivideCards } from './integers/intDivide';
import { intMixedCards } from './integers/intMixed';
import { equivalentFractionCards } from './fractions/equivalent';
import { nsCompareDecimalsCards } from './number-sense/nsCompareDecimals';
import { nsCompareWholeCards } from './number-sense/nsCompareWhole';
import { nsFormsCards } from './number-sense/nsForms';
import { nsOrderingCards } from './number-sense/nsOrdering';
import { nsRoundDecimalsCards } from './number-sense/nsRoundDecimals';
import { nsRoundWholeCards } from './number-sense/nsRoundWhole';
import { pvDecimalCards } from './number-sense/pvDecimal';
import { pvDivide10Cards } from './number-sense/pvDivide10';
import { pvMultiply10Cards } from './number-sense/pvMultiply10';
import { pvPowersOfTenCards } from './number-sense/pvPowersOfTen';
import { pvWholeCards } from './number-sense/pvWhole';
import { fractionsNumberLineCards } from './fractions/numberLine';
import { fractionsAsDivisionCards } from './fractions/asDivision';
import { fractionsSimplifyingCards } from './fractions/simplifying';
import { fractionsCompareCards } from './fractions/compare';
import { fractionsOrderingCards } from './fractions/ordering';
import { fractionsProperImproperCards } from './fractions/properImproper';
import { fractionsMixedNumbersCards } from './fractions/mixedNumbers';
import { fractionsMixedImproperCards } from './fractions/mixedImproper';
import { fasLikeCards } from './fractions/fasLike';
import { fasSubtractLikeCards } from './fractions/fasSubtractLike';
import { fasUnlikeCards } from './fractions/fasUnlike';
import { fasMixedAddCards } from './fractions/fasMixedAdd';
import { fasMixedSubtractCards } from './fractions/fasMixedSubtract';
import { fasBorrowingCards } from './fractions/fasBorrowing';
import { fmulWholeCards } from './fractions/fmulWhole';
import { fmulFractionCards } from './fractions/fmulFraction';
import { fmulMixedCards } from './fractions/fmulMixed';
import { fmulScalingCards } from './fractions/fmulScaling';
import { fdivWholeByUnitCards } from './fractions/fdivWholeByUnit';
import { fdivUnitByWholeCards } from './fractions/fdivUnitByWhole';
import { fdivVisualCards } from './fractions/fdivVisual';
import { fractionPartsCards } from './fractions/parts';

/** Register every card module here. Order doesn't matter — decks are ordered by learning stage. */
export const grade5Cards: Flashcard[] = [
  // Number Sense
  ...pvWholeCards,
  ...pvDecimalCards,
  ...pvPowersOfTenCards,
  ...pvMultiply10Cards,
  ...pvDivide10Cards,
  ...nsFormsCards,
  ...nsCompareWholeCards,
  ...nsCompareDecimalsCards,
  ...nsOrderingCards,
  ...nsRoundWholeCards,
  ...nsRoundDecimalsCards,
  // Word Problems & Math Reasoning
  ...wpRuncCards,
  ...wpAddSubtractCards,
  ...wpMultiplyDivideCards,
  ...wpFractionsCards,
  ...wpDecimalsCards,
  ...wpMoneyCards,
  ...wpElapsedTimeCards,
  ...wpMeasurementCards,
  ...wpVolumeCards,
  ...wpTwoStepCards,
  ...wpMultiStepCards,
  ...wpMissingInfoCards,
  ...wpExtraInfoCards,
  ...mrEstimateFirstCards,
  ...mrDrawPictureCards,
  ...mrMakeTableCards,
  ...mrFindPatternCards,
  ...mrWorkBackwardsCards,
  ...mrEliminateCards,
  ...mrInverseCheckCards,
  ...mrUnnecessaryInfoCards,
  ...mrReasonableCards,
  // Operations
  ...mulEstimationCards,
  ...mulAreaModelCards,
  ...mulPartialProductsCards,
  ...mul2x2Cards,
  ...mul3x2Cards,
  ...mulStandardAlgorithmCards,
  ...mulCheckDivisionCards,
  ...divMeaningCards,
  ...divLongDivisionCards,
  ...divRemaindersCards,
  ...div4Digit1DigitCards,
  ...divEstimateCards,
  ...div2DigitDivisorCards,
  ...divCheckMultiplicationCards,
  ...fmFactorPairsCards,
  ...fmDivisibilityCards,
  ...fmEvenOddCards,
  ...fmPrimeCompositeCards,
  ...fmPrimeFactorizationCards,
  ...fmCommonFactorsCards,
  ...fmGcfCards,
  ...fmMultiplesCards,
  ...fmCommonMultiplesCards,
  ...fmLcmCards,
  // Decimals
  ...decPlacesCards,
  ...decReadWriteCards,
  ...decCompareCards,
  ...decRoundCards,
  ...decAddCards,
  ...decSubtractCards,
  ...decMultiplyCards,
  ...decMultiplySmallerCards,
  ...decDivideCards,
  ...decPowersOfTenCards,
  ...fdBenchmarksCards,
  ...fdFractionToDecimalCards,
  ...fdDecimalToFractionCards,
  // Algebra
  ...exprParenthesesCards,
  ...exprOrderOfOperationsCards,
  ...exprEvaluateCards,
  ...exprWordsToMathCards,
  ...exprVsEquationCards,
  ...algNumberPatternsCards,
  ...algInputOutputCards,
  ...algTwoRulePatternsCards,
  ...algVariablesCards,
  ...algMissingNumbersCards,
  ...algEquationsCards,
  // Times Tables
  ...timesTableStrategyCards,
  ...timesTableCards,
  // Integers (Grade 6–7 preview)
  ...intMeaningCards,
  ...intNumberLineCards,
  ...intAbsoluteValueCards,
  ...intAddSameCards,
  ...intAddDifferentCards,
  ...intSubtractCards,
  ...intMultiplyCards,
  ...intDivideCards,
  ...intMixedCards,
  // Fractions
  ...fractionPartsCards,
  ...equivalentFractionCards,
  ...fractionsNumberLineCards,
  ...fractionsAsDivisionCards,
  ...fractionsSimplifyingCards,
  ...fractionsCompareCards,
  ...fractionsOrderingCards,
  ...fractionsProperImproperCards,
  ...fractionsMixedNumbersCards,
  ...fractionsMixedImproperCards,
  ...fasLikeCards,
  ...fasSubtractLikeCards,
  ...fasUnlikeCards,
  ...fasMixedAddCards,
  ...fasMixedSubtractCards,
  ...fasBorrowingCards,
  ...fmulWholeCards,
  ...fmulFractionCards,
  ...fmulMixedCards,
  ...fmulScalingCards,
  ...fdivWholeByUnitCards,
  ...fdivUnitByWholeCards,
  ...fdivVisualCards,
];
