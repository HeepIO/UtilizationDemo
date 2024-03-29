import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as Actions from 'reducers/actions'
import { buttonLink } from '../utilities/ButtonUtils'

import { Grid }   from 'material-ui';
import { CircularProgress } from 'material-ui/Progress';

const mapStateToProps = (state) => ({
  checkoutID: state.checkoutID,
  cart: state.shoppingCart
})


class Checkout extends React.Component {

  constructor(props){
    super(props) 
    this.state = {
      loading: true
    }
  }

  render() {

    var inputs = {
      checkoutFrame: {
        src: this.props.cart.webUrl,
        width: "100%",
        height: 1500,
        frameBorder: 0,
        onLoad: () => this.setState({loading: false})
      }
    }

    if (this.props.cart.webUrl != null) {

         return (
          <Grid container spacing={24} style={{maxWidth:'100%', padding:24}}>
            <Grid item xs={12}>
              {buttonLink('Back to Cart', '/MyCart', 'left')}
            </Grid>

            <Grid item xs={12}>
              <iframe {...inputs.checkoutFrame}/>
              {this.state.loading && 
              <div style={{
                position: "absolute",
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '100%'
              }}>
                <CircularProgress size={350} />
              </div>
            }
            </Grid>
          </Grid>);

    } else {

      return <div> Add some items to your cart before checkout out!</div>
    }
	 
  
  }
}



function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Checkout))
