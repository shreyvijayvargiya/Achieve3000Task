import React, { useEffect, useState } from 'react';
import { Button, Accordion, Paper, Grid, AccordionSummary, AccordionDetails, CircularProgress, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const App = () => {
    const styles = useStyles();
    const [stationsData, setStationsData] = useState({
        stationsInformation: [],
        stationsStatus: [],
        singleStationStatus: true
    });
    const [loader, setLoader] = useState(true);
    
    const fetchStationInformationData = () => axios.get('https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information');
    const fetchStationsStatusData = () => axios.get('https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_status');

    const fetchBothStationInformationAndStationStatus = () => {
        const response = axios.all([ fetchStationInformationData(), fetchStationsStatusData()]);
        response.then(axios.spread((data1, data2) => {
           setStationsData({
               stationsInformation: data1.data.data.stations.splice(0, 50),
               stationsStatus: data2.data.data.stations
           });
           setLoader(false);
        }));
        if(loader && stationsData.stationsInformation.length > 0 && stationsData.stationsStatus.length > 0) setLoader(false);
    }

    useEffect(() => {
        fetchBothStationInformationAndStationStatus();
    }, []);

    
    const StationStatus = (id) => {
        const singleStationData = stationsData.stationsStatus.filter(item => {
            if(item.station_id === id){
                return item
            }
        });
        console.log(singleStationData[0])
        return (
            <AccordionDetails>
                <Typography variant="body1">
                    Capacity {singleStationData[0].num_bikes_available}
                </Typography>
            </AccordionDetails>
        );
    };

    return (
        <div className={styles.root}>
            <Grid container justify="space-between" alignItems="center" className={styles.heading}>
                <Grid item md={8} lg={8} sm={8} xs={12} className={styles.headingText}>
                    <h1>Bike Stations</h1>
                </Grid>
                <Grid item md={4} lg={4} sm={4} xs={12}>
                    <Button 
                        variant="contained" 
                        color="primary"
                        className={styles.button}
                    >
                        Station Name
                    </Button>
                    <Button 
                        variant="outlined" 
                        color="primary"
                        className={styles.button}
                    > 
                        Capacity
                    </Button>
                </Grid>
            </Grid>
            <Paper elevation={4} className={styles.container}>
                <p>Search Button</p>
                {!loader && stationsData.stationsInformation.length> 0 ? (
                    stationsData.stationsInformation.map((item, index) => {
                        return (
                            <Accordion key={index} onClick={() => setStationsData(prevState => ({ ...prevState, singleStationStatus: true }))} className={styles.item}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    >
                                    <Typography variant="h6">{item.name} {item.capacity}</Typography>
                                </AccordionSummary>
                                {stationsData.singleStationStatus && StationStatus(item.station_id)}
                            </Accordion>
                        )
                    })
                ):
                <CircularProgress style={{ fontSize: 32, color: 'black' }} />
            }
            </Paper>
        </div>
    )
};

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        margin: 'auto'
    },
    container: {
        width: '70%',
        margin: 'auto',
        height: '80vh',
        overflow: 'scroll',
        border: '1px solid #2d2d2d',
        padding: theme.spacing(4),
        [theme.breakpoints.down('md')]:{
            width: '90%',
        }
    },
    heading: {
        width: '70%',
        margin: 'auto'
    },
    item: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        "&:hover": {
            backgroundColor: '#EEEEEE'
        }
    },
    headingText: {
        textAlign: 'left',
        [theme.breakpoints.down('md')]:{
            textAlign: 'center'
        }
    },
    button: {
        margin: 5,
        [theme.breakpoints.down('md')]:{
            margin: theme.spacing(2)
        }
    }
}))
export default App;
