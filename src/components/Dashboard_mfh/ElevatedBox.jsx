import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
    borderRadius: '10px'
  }
};

function ElevatedBox(props) {
  const { classes } = props;
  return <div className={classes.root}>{props.children}</div>;
}

export default withStyles(styles)(ElevatedBox);
