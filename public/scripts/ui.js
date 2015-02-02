/** @jsx React.DOM */
window.chanakya = window.chanakya || {};

React.render(
  React.createElement("h2", null, "chanakya"),
  document.getElementById('title')
);

window.chanakya.selectedService = 'Ola';

var CabService = React.createClass({displayName: "CabService",
	handleClick: function(event){
		console.log(this.props.name + ' clicked');
		window.chanakya.selectedService = this.props.name;
	},
	render: function() {
		return (
			React.createElement("td", {className: this.props.active}, 
	            React.createElement("div", {onClick: this.handleClick}, 
	              React.createElement("img", {src: this.props.icon}), 
	              React.createElement("span", null, " ", this.props.name, " ")
	            )
	          )
		);
	}
});

var CabServicesList = React.createClass({displayName: "CabServicesList",
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
            React.createElement("table", null, 
		        React.createElement("tr", null, 
		        	this.state.items.map(function(item, i) {
			          return (
			            React.createElement(CabService, {icon: item.icon, name: item.name})
			          );
			        }, this)
		        )
	      	)
        );
    }
});


React.render(
	React.createElement("div", null, 
		React.createElement("div", {id: "services"}, 
	    	React.createElement(CabServicesList, null)
	    ), 
	    React.createElement("div", {id: "types"}), 
	    React.createElement("div", {id: "details"})
    ),
    document.getElementById('cabdetails')
);

