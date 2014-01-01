
/*
 * GET home page.
 */

exports.index = function(req, res){
	var zoneData = [
		{
			title: "Master Bed Room"
			,status: 1
			,num: 1
		},{
			title: "Blake's Bed Room"
			,status: 1
			,num: 2
		},{
			title: "First Floor"
			,status: 0
			,num: 3
		},{
			title: "First Floor Radiant"
			,status: 1
			,num: 4
		},{
			title: "Domestic Hot Water"
			,status: 0
			,num: 5
		},{
			title: "Basement Radiant"
			,status: 0
			,num: 6
		}
	];
	res.render('index', { 
		title: 'Heating Control Panel'
		,data: zoneData
	});
};