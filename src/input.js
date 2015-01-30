React.render(
  <h2>chanakya</h2>,
  document.getElementById('title')
);

React.render(
	<div>
		<div id='services'>
	      <table>
	        <tr>
	          <td className='active'>
	            <div>
	              <img src='images/ola-icon-50x50.png' alt='OL'/>
	              <span> Ola </span>
	            </div>
	          </td>
	          <td>
	            <div>
	              <img src='images/uber-icon-50x50.png' alt='UB'/>
	              <span> Uber </span>
	            </div>
	          </td>
	          <td>
	            <div>
	              <img src='images/tfs-icon-50x50.jpg' alt='TFS'/>
	              <span> TFS </span>
	            </div>
	          </td>
	          <td>
	            <div>
	              <img src='images/meru-icon-50x50.jpg' alt='MR'/>
	              <span> Meru </span>
	            </div>
	          </td>
	        </tr>
	      </table>
	    </div>
	    <hr/>
	    <div id='types'></div>
	    <div id='details'></div>
    </div>,
    document.getElementById('cabdetails')
);
