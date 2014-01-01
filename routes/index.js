
/*
 * GET home page.
 */

exports.index = function(req, res){
	var zoneData = [
		{
			title: "Master Bed Room"
			,status: -1 //1 = on; 0=off; else blue=undef
			,num: 0
		},{
			title: "Blake's Bed Room"
			,status: -1
			,num: 1
		},{
			title: "First Floor"
			,status: -1
			,num: 2
		},{
			title: "First Floor Radiant"
			,status: -1
			,num: 3
		},{
			title: "Domestic Hot Water"
			,status: -1
			,num: 4
		},{
			title: "Basement Radiant"
			,status: -1
			,num: 5
		}
	];
	res.render('index', { 
		title: 'Heating Control Panel'
		,data: zoneData
	});
};