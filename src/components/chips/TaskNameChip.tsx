import React from 'react';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Bookmark from '@mui/icons-material/Bookmark';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { TaskNameChip_task } from './__generated__/TaskNameChip_task.graphql';
import { navigateTaskHelper } from '../../utils/navigateHelper';
import { useNavigate } from 'react-router-dom';

const styles = theme =>
  createStyles({
    avatar: {
      backgroundColor: theme.palette.primary.main,
    },
    avatarIcon: {
      color: theme.palette.primary.contrastText,
    },
  });

interface Props extends WithStyles<typeof styles> {
  task: TaskNameChip_task;
  className?: string;
  withNavigation?: boolean;
}

let TaskNameChip = (props: Props) => {
  const { task, className, classes } = props;
  let navigate = useNavigate();

  // We use the empty handler when we won't the navigation to happen, yet it helps e.g. Vimium (http://vimium.github.io/)
  // to recognize that task names are clickable and thus improves accessibility.
  var onClickFunc = props.withNavigation ? e => navigateTaskHelper(navigate, e, task.id) : () => {};

  return (
    <Chip
      className={className}
      label={task.name}
      onClick={onClickFunc}
      avatar={
        <Avatar className={classes.avatar}>
          <Bookmark className={classes.avatarIcon} />
        </Avatar>
      }
    />
  );
};

export default createFragmentContainer(withStyles(styles)(TaskNameChip), {
  task: graphql`
    fragment TaskNameChip_task on Task {
      id
      name
    }
  `,
});
