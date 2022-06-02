import { FunctionComponent } from 'react';
import { Grid,Button, TextField } from '@mui/material';

const HomeScreen: FunctionComponent = ()=> {
    return (
        <Grid container justifyContent="space-between" pl={2} pr={2}>
            <Grid>Home screen</Grid>
            <Grid>SignOut</Grid>
        </Grid>
    )
}

export default HomeScreen