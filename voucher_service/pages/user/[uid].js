import firebase from 'firebase';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { firebaseConf } from '../../lib/config'
import AppBar from '@material-ui/core/AppBar'
import { 
    IconButton, 
    Toolbar, 
    Typography, 
    Button, 
    Container, 
    Drawer,
    CssBaseline,
    Divider,
    List,
    ListItem,
    ListItemText,
 } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu';

const firebaseConfig = firebaseConf;

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    title: {
        flexGrow: 1,
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  }));

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

function userScreen() {
    const classes = useStyles();
    const theme = useTheme();

    const [isSignedIn, setIsSignedIn] = useState(false);
    const [open, setOpen] = useState(false);

    const router = useRouter();

    // This creates the logout routine
    const logout = () => {
        firebase.auth().signOut();
        setIsSignedIn(false);
    }  

    // This checks if the user is signed in
    useEffect(() => {
        const authObserver = firebase.auth().onAuthStateChanged(user => {
            if(user) {
                setIsSignedIn(!!user);
            } else {
                setIsSignedIn(false);
            }
        });
        return () => authObserver();
    }, []);

    // This handles the open and close action of the drawer
    const handleDrawerOpen = () => {
        setOpen(true);
    }

    const handleDrawerClose = () => {
        setOpen(false);
    }

    if(isSignedIn) {
        if(isSignedIn) {
            return (
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar
                        position="fixed"
                        className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                        })}
                    >
                        <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            User Dashboard
                        </Typography>
                        <Button color="inherit" onClick={() => logout()}>Logout</Button>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        className={classes.drawer}
                        variant="persistent"
                        anchor="left"
                        open={open}
                        classes={{
                        paper: classes.drawerPaper,
                        }}
                    >
                        <div className={classes.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                        </div>
                        <Divider />
                        <List>
                        {['Voucher Booking', 'Voucher History', 'Settings'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                        </List>
                    </Drawer>
                    <main
                        className={clsx(classes.content, {
                        [classes.contentShift]: open,
                        })}
                    >
                        <div className={classes.drawerHeader} />
                        <Container maxWidth="md">
                            <div>
                                <h1>Voucher-service</h1>
                                <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed in!</p>
                                <button onClick={() => logout()}>Logout</button>
                            </div>
                        </Container>
                    </main>
                </div>
            )
        } else {
            router.replace('/login');
        }
    }

    // loading screen goes here
    return (
        <div>
            <h1>Loading</h1>
        </div>
    )
}

export default userScreen;