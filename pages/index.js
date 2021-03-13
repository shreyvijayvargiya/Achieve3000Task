import React, { useEffect, useState } from 'react';
import { Button, Accordion, Paper, Grid, AccordionSummary,Input, AccordionDetails, CircularProgress, Typography, TextField, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { setStationInformations, setStationStatus, setSearchedData } from '../Redux/action/addStationsInformation';
import { useDispatch, useSelector } from 'react-redux';

const App = () => {
    const styles = useStyles();
    const [stationsData, setStationsData] = useState({
        stationsInformation: [],
        stationsStatus: [],
        singleStationStatus: true,
        searchedData: []
    });
    const data = useSelector(state => state);
    const dispatch = useDispatch();
    
    const [searchValue, setSearchValue] = useState("");
    const [searchLoader, setSearchLoader]= useState(true);
    const [loader, setLoader] = useState(true);
    
    const fetchStationInformationData = () => axios.get('https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information');
    const fetchStationsStatusData = () => axios.get('https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_status');

    const fetchBothStationInformationAndStationStatus = () => {
        const response = axios.all([ fetchStationInformationData(), fetchStationsStatusData()]);
        response.then(axios.spread((data1, data2) => {
            const sortStationInformatonData = data1.data.data.stations.splice(0, 50).sort((a, b) => {
                if(a.name < b.name){ return -1 };
                if(a.name > b.name) { return 1 };
                return 0;
            });
            dispatch(setStationInformations(sortStationInformatonData));
            dispatch(setStationStatus(data2.data.data.stations))
            setLoader(false);
        }));
    };
    
    const fetchDataFromStore = () => {
        setLoader(true);
        setStationsData({
            stationsInformation: data.stationsInformation,
            stationsStatus: data.stationsStatus,
            searchedData: data.searchedData,
            singleStationStatus: true,
        });
        if(loader && stationsData.stationsInformation.length > 0 && stationsData.stationsStatus.length > 0) setLoader(false);
    }
    

    useEffect(() => {
        fetchBothStationInformationAndStationStatus();
        fetchDataFromStore();
    }, []);

    
    const StationStatus = (id) => {
        const singleStationData = stationsData.stationsStatus.filter(item => {
            if(item.station_id === id){
                return item
            }
        });
        return (
            <AccordionDetails>
                <Typography variant="body1">
                    Capacity {singleStationData[0].num_bikes_available}
                </Typography>
            </AccordionDetails>
        );
    };

    const filterData = (e) => {
        setLoader(true);
        const val = e.target.value;
        if(val.length>0){
            setSearchValue(val);
            const searchedData = data.stationsInformation.filter(item => {
                if((item.name).toUpperCase().includes(val.toUpperCase())){
                    return item
                }
            });
            dispatch(setSearchedData(searchedData));
            setLoader(false);
        }else {
            setLoader(false);
            setSearchValue("")
            return
        }
    }
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
                <TextField 
                    fullWidth
                    onChange={(e) => filterData(e)}
                    value={searchValue}
                    type="text"
                    placeholder="Search by name"
                    color="primary"
                    variant="outlined"
                />
                <br />
                <br />
                {!loader ? (
                    <div>
                        {searchValue.length === 0 && data.searchedData.length === 0 ? (
                            stationsData.stationsInformation.map((item, index) => {
                                return (
                                    <Accordion key={index} onClick={() => setStationsData(prevState => ({ ...prevState, singleStationStatus: true }))} className={styles.item}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                            className={styles.accordionHeading}
                                            >
                                            <Typography variant="h6">{item.name} {item.capacity}</Typography>
                                        </AccordionSummary>
                                        {stationsData.singleStationStatus && StationStatus(item.station_id)}
                                    </Accordion>
                                )
                            })
                        ):
                        data.searchedData.map((item, index) => {
                            return (
                                <Accordion key={index} onClick={() => setStationsData(prevState => ({ ...prevState, singleStationStatus: true }))} className={styles.item}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        className={styles.accordionHeading}
                                        >
                                        <Typography variant="h6">{item.name} {item.capacity}</Typography>
                                    </AccordionSummary>
                                    {stationsData.singleStationStatus && StationStatus(item.station_id)}
                                </Accordion>
                            )
                        })
                    }
                    </div>
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
    },
    headingText: {
        textAlign: 'left',
        [theme.breakpoints.down('md')]:{
            textAlign: 'center'
        }
    },
    accordionHeading: {
        "&:hover": {
            backgroundColor: '#EEEEEE'
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
