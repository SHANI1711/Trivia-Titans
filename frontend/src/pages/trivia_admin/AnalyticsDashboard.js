import React from 'react';
import Link from '@mui/material/Link';

const AnalyticsDashboard = () => {
	const embedLink = 'dashboard-api';

	return (
		<div>
			<h1>User Statastics</h1>
			<p>
				Report Link: <Link href={embedLink}>User statistics</Link>
			</p>
		</div>
	);
};

export default AnalyticsDashboard;
