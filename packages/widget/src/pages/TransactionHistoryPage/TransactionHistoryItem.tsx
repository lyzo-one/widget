import type {
  ExtendedTransactionInfo,
  FullStatusData,
  StatusResponse,
  TokenAmount,
} from '@lifi/sdk';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Token, TokenDivider } from '../../components/Token';
import { navigationRoutes } from '../../utils';

export const TransactionHistoryItem: React.FC<{
  transaction: StatusResponse;
  size: number;
  start: number;
}> = ({ transaction, size, start }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const sending: ExtendedTransactionInfo =
    transaction.sending as ExtendedTransactionInfo;
  const receiving: ExtendedTransactionInfo =
    transaction.receiving as ExtendedTransactionInfo;

  const handleClick = () => {
    navigate(navigationRoutes.transactionDetails, {
      state: {
        transactionHash: (transaction as FullStatusData).sending.txHash,
      },
    });
  };

  const startedAt = new Date(
    ((sending as ExtendedTransactionInfo).timestamp ?? 0) * 1000,
  );

  if (!sending.token?.chainId || !receiving.token?.chainId) {
    return null;
  }

  const fromToken: TokenAmount = {
    ...sending.token,
    amount: BigInt(sending.amount ?? '0'),
    priceUSD: sending.token.priceUSD ?? '0',
    symbol: sending.token?.symbol ?? '',
    decimals: sending.token?.decimals ?? 0,
    name: sending.token?.name ?? '',
    chainId: sending.token?.chainId,
  };

  const toToken: TokenAmount = {
    ...receiving.token,
    amount: BigInt(receiving.amount ?? '0'),
    priceUSD: receiving.token.priceUSD ?? '0',
    symbol: receiving.token?.symbol ?? '',
    decimals: receiving.token?.decimals ?? 0,
    name: receiving.token?.name ?? '',
    chainId: receiving.token?.chainId,
  };

  return (
    <Card
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        // height: `${size}px`,
        transform: `translateY(${start}px)`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
        }}
        pt={1.75}
        px={2}
      >
        <Typography fontSize={12}>
          {new Intl.DateTimeFormat(i18n.language, { dateStyle: 'long' }).format(
            startedAt,
          )}
        </Typography>
        <Typography fontSize={12}>
          {new Intl.DateTimeFormat(i18n.language, {
            timeStyle: 'short',
          }).format(startedAt)}
        </Typography>
      </Box>
      <Box px={2} py={2}>
        <Token token={fromToken} />
        <Box pl={2.375} py={0.5}>
          <TokenDivider />
        </Box>
        <Token token={toToken} />
      </Box>
    </Card>
  );
};
