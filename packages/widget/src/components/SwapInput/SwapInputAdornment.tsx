import { InputAdornment, Skeleton } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTokenBalance } from '../../hooks';
import {
  SwapFormKeyHelper,
  SwapFormTypeProps,
} from '../../providers/SwapFormProvider';
import { SwapMaxAmountTypography } from './SwapInputAdornment.style';

export const SwapInputAdornment: React.FC<SwapFormTypeProps> = ({
  formType,
}) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const [chainId, tokenAddress] = useWatch({
    name: [
      SwapFormKeyHelper.getChainKey(formType),
      SwapFormKeyHelper.getTokenKey(formType),
    ],
  });
  const { token, isLoading, isFetching } = useTokenBalance(
    chainId,
    tokenAddress,
  );

  const handleMax = () => {
    setValue(SwapFormKeyHelper.getAmountKey(formType), token?.amount ?? '');
  };

  return (
    <InputAdornment position="end">
      {isLoading && isFetching ? (
        <Skeleton
          variant="rectangular"
          width={96}
          height={24}
          sx={{ borderRadius: 0.5 }}
        />
      ) : formType === 'from' && token?.amount ? (
        <SwapMaxAmountTypography
          onClick={handleMax}
          role="button"
          sx={{
            userSelect: 'none',
          }}
          data-amount={token?.amount}
        >
          {t(`swap.maxAmount`, {
            amount: token?.amount,
          })}
        </SwapMaxAmountTypography>
      ) : null}
    </InputAdornment>
  );
};
