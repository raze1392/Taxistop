/** @jsx React.DOM */
window.chanakya = window.chanakya || {};

React.render(
  <h2>chanakya</h2>,
  document.getElementById('title')
);

window.chanakya.selectedService = 'Ola';

var CabService = React.createClass({
	handleClick: function(event){
		console.log(this.props.name + ' clicked');
		window.chanakya.selectedService = this.props.name;
	},
	render: function() {
		return (
			<td className={this.props.active}>
	            <div onClick={this.handleClick}>
	              <img src={this.props.icon}/>
	              <span> {this.props.name} </span>
	            </div>
	          </td>
		);
	}
});

var CabServicesList = React.createClass({
    getInitialState: function(){
    	return {
    		items: [
    			{
    				name: "Ola",
    				icon: "images/ola-icon-50x50.png"
    			},
    			{
    				name: "Uber",
    				icon: "images/uber-icon-50x50.png"
    			},{
    				name: "TFS",
    				icon: "images/tfs-icon-50x50.jpg"
    			},{
    				name: "Meru",
    				icon: "images/meru-icon-50x50.jpg"
    			}
    		]
    	};
    },
    render: function () {
        return (
            <table>
		        <tr>
		        	{this.state.items.map(function(item, i) {
			          return (
			            <CabService icon={item.icon} name={item.name} />
			          );
			        }, this)}
		        </tr>
	      	</table>
        );
    }
});


React.render(
	<div>
		<div id='services'>
	    	<CabServicesList />
	    </div>
	    <div id='types'></div>
	    <div id='details'></div>
    </div>,
    document.getElementById('cabdetails')
);

