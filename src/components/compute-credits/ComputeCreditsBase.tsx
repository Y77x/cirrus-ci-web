import Button from '@mui/material/Button/Button';
import Card from '@mui/material/Card/Card';
import CardActions from '@mui/material/CardActions/CardActions';
import CardContent from '@mui/material/CardContent/CardContent';
import CardHeader from '@mui/material/CardHeader/CardHeader';
import Collapse from '@mui/material/Collapse/Collapse';
import { orange } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton/IconButton';
import Typography from '@mui/material/Typography/Typography';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import classNames from 'classnames';
import React, { useState } from 'react';
import BillingSettingsButton from './BillingSettingsButton';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { ComputeCreditsBase_info } from './__generated__/ComputeCreditsBase_info.graphql';
import { Helmet as Head } from 'react-helmet';
import ComputeCreditsStripeDialog from './ComputeCreditsStripeDialog';
import { Link } from '@mui/material';

const styles = theme =>
  createStyles({
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    buttonSpacing: {
      marginRight: '8px',
    },
    gap: {
      paddingTop: 16,
    },
    modal: {
      top: '25%',
      margin: 'auto',
      position: 'absolute',
      width: theme.spacing(50.0),
      backgroundColor: theme.palette.primary.contrastText,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(4.0),
    },
    credits: {
      color: orange[700],
      '&:hover': {
        color: orange[900],
      },
    },
  });

interface Props extends WithStyles<typeof styles> {
  transactionsComponent: JSX.Element;
  info?: ComputeCreditsBase_info;
  balanceInCredits?: string;
  ownerUid: string;
}

function ComputeCreditsBase(props: Props) {
  let [expanded, setExpanded] = useState(false);
  let [openBuyCredits, setOpenBuyCredits] = useState(false);
  let { classes } = props;

  return (
    <Card elevation={24}>
      <CardHeader title="Compute Credits" />
      <Head>
        <script src="https://js.stripe.com/v3/" async></script>
      </Head>
      <CardContent>
        <Typography variant="h6">
          Your current compute credits balance: <b className={classes.credits}>{props.balanceInCredits || '0.00'}</b>
        </Typography>
        <div className={classes.gap} />
        <Typography variant="subtitle1">
          <p>
            Compute credits are used for buying <b>priority</b> CPU time on Community Clusters for your projects. It
            allows not to bother about configuring{' '}
            <Link color="inherit" href="https://cirrus-ci.org/guide/supported-computing-services/">
              Compute Services
            </Link>{' '}
            and focus on the product instead of infrastructure.
          </p>
          <p>
            Read more about compute credits and how to use them in{' '}
            <Link color="inherit" href="https://cirrus-ci.org/pricing/#compute-credits">
              documentation
            </Link>
            .
          </p>
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button variant="contained" onClick={() => setOpenBuyCredits(true)} className={classes.buttonSpacing}>
          <AttachMoneyIcon />
          Add More Credits
        </Button>
        <BillingSettingsButton info={props.info} />
        <IconButton
          className={classNames(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="Show Transactions"
          size="large"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>{props.transactionsComponent}</CardContent>
      </Collapse>
      <ComputeCreditsStripeDialog
        ownerUid={props.ownerUid}
        open={openBuyCredits}
        onClose={() => setOpenBuyCredits(false)}
      />
    </Card>
  );
}

export default createFragmentContainer(withStyles(styles)(ComputeCreditsBase), {
  info: graphql`
    fragment ComputeCreditsBase_info on OwnerInfo {
      ...BillingSettingsButton_info
    }
  `,
});
