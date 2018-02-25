import React, { Component } from 'react';                            

function generateAntWinLikelihoodCalculator() {
    var delay = 7000 + Math.random() * 7000;
    var likelihoodOfAntWinning = Math.random();

    return function(callback) {
        setTimeout(function() {
            callback(likelihoodOfAntWinning);
        }, delay);
    };
}


const ChannelsList = ({ data, loading, raceClick }) => {
    data.sort( (a,b) => {
        return a.likelyHood - b.likelyHood;
    })
    data.reverse();
    return <ol>
        { data.map( ant =>  
        <li key={ant.name}>
            <p className="lead">{ant.name}</p>
            <p style={{'color': `${ant.color}` }}> {ant.color}  </p>
            <p> {ant.length} </p>
            <p> {ant.weight} </p>
            { raceClick ?  <p> Not Yet Run </p> :
            <p> {ant.likelyHood == null ? 'In progress' : ant.likelyHood } </p> }
        </li>
        ) }
    </ol>;
};

class App extends Component {                                        
    constructor(){
        super();
        this.state = {
            data: [],
            loading: true,
            allLoading: true,
            raceClick: true,
        };
        this.calculateAnts = this.calculateAnts.bind(this);
    }; 
    componentWillMount() {
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const target = 'https://guarded-shore-81814.herokuapp.com/graphql';
        fetch(proxyurl + target, {
            method: 'POST',
            body: JSON.stringify({ query: '{ants {name,color,length,weight} }' }),
            headers: { 
                'Content-Type': 'application/json' },
        })
            .then(res => res.json())
            .then(res => this.setState({data: res.data.ants, loading: false}));
    }
    componentDidUpdate(prevProps, prevState) {
        let val = false;
        this.state.data.forEach( ant => {
            val = ant.likelyHood == null ? true : false;
        })
        if(!val && prevState.allLoading) {
            this.setState({ allLoading: false})
        }
    } 
    calculateAnts(){
        const _this = this;
        this.setState({raceClick: false})
        this.state.data.forEach( ant=> {
            generateAntWinLikelihoodCalculator()(function(value) {
                ant.likelyHood =  value;
                _this.setState({ data: _this.state.data})
            })
        } )
    }
    render() {
        const {loading,raceClick,allLoading} = this.state;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <h1>Ant Racing Scene </h1>
                    </div>
                </div>
                {loading ? <h1> ...Loading </h1>: 
                <div className="row">
                    <div className="col-sm-12">
                        <h2>The Ants 
                        </h2>
                        { raceClick ?  <h2> Not Yet Run </h2> :
                        <h2> {allLoading ? 'In progress' : 'All Calculated'} </h2> }
                        <button disabled={this.state.loading} type="button" className="btn btn-primary" onClick={this.calculateAnts}>Calculate All Ants</button>
                    </div>
                    <ChannelsList 
                        data = { this.state.data}
                        raceClick ={this.state.raceClick}
                    />
                </div>
            }
                <div className="row">
                    <div>
                        Here are the specifications provided by our stakeholders:

                        Information about competing ants must be acquired from a GraphQL API located at the following endpoint: https://antserver-blocjgjbpw.now.sh/graphql (if this link is down for some reason, there is a backup at https://guarded-shore-81814.herokuapp.com/graphql)
                        All available information on the ants should be displayed in a pleasing UI designed at your discretion.
                        You must provide a way for users to calculate the odds of each ant winning.
                        We have provided the function which provides the means to calculate the likelihood of an ant winning below (see 'Ant-win likelihood algorithm'), which you must use as-is.
                        Users must be able to begin running calculations on all ants simultaneously.
                        The UI must reflect the state of each ant's win likelihood calculation (not yet run, in progress, calculated, etc.)
                        In addition, the UI must display the state of all tests together (not yet run, in progress, all calculated).
                        As the results come in, ants must be ordered by their calculated likelihood of winning.
                        The app should be written in Javascript, but how you implement the app is up to your discretion.
                        When you're done, please send us a link to your submission's GitHub repo, and instructions on how to run it.

                    </div>

                    <div className="row">
                        <small className="text-muted">Samuel Witke witkesam@gmail.com </small>
                    </div>
            </div>
            </div>
        );
    }
}
export default App; 
