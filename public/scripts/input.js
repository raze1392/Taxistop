React.render(
  React.createElement("h2", null, "chanakya"),
  document.getElementById('title')
);

React.render(
	React.createElement("div", null, 
		React.createElement("div", {id: "services"}, 
	      React.createElement("table", null, 
	        React.createElement("tr", null, 
	          React.createElement("td", {className: "active"}, 
	            React.createElement("div", null, 
	              React.createElement("img", {src: "images/ola-icon-50x50.png", alt: "OL"}), 
	              React.createElement("span", null, " Ola ")
	            )
	          ), 
	          React.createElement("td", null, 
	            React.createElement("div", null, 
	              React.createElement("img", {src: "images/uber-icon-50x50.png", alt: "UB"}), 
	              React.createElement("span", null, " Uber ")
	            )
	          ), 
	          React.createElement("td", null, 
	            React.createElement("div", null, 
	              React.createElement("img", {src: "images/tfs-icon-50x50.jpg", alt: "TFS"}), 
	              React.createElement("span", null, " TFS ")
	            )
	          ), 
	          React.createElement("td", null, 
	            React.createElement("div", null, 
	              React.createElement("img", {src: "images/meru-icon-50x50.jpg", alt: "MR"}), 
	              React.createElement("span", null, " Meru ")
	            )
	          )
	        )
	      )
	    ), 
	    React.createElement("hr", null), 
	    React.createElement("div", {id: "types"}), 
	    React.createElement("div", {id: "details"})
    ),
    document.getElementById('cabdetails')
);
