import React from 'react';
import './landingPage.css';
import Path from '../../constants/path';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Grid, Typography } from '@mui/material';

function LandingPage() {
	const navigate = useNavigate();

	return (
		<Container>
			<Grid
				container
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{ minHeight: '50vh' }}
			>
				<Grid item>
					<Typography
						variant="h1"
						className="landing_page_title"
						style={{
							color: '#007bff',
							marginBottom: '10rem',
							fontWeight: 'bold',
						}}
					>
						Welcome to Trivia Titans
					</Typography>
				</Grid>
				<Grid
					item
					container
					direction="column"
					alignItems="center"
					spacing={2}
				>
					<Grid item>
						<Button
							component={Link}
							to={Path.LOGIN}
							variant="contained"
							color="primary"
							className="login_btn"
							style={{ marginBottom: '0.5rem' }}
						>
							Login
						</Button>
					</Grid>
					<Grid item>
						<Button
							component={Link}
							to={Path.SIGNUP}
							variant="contained"
							color="primary"
							className="login_btn"
							style={{ marginBottom: '0.5rem' }}
						>
							SignUp
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</Container>
	);
}

export default LandingPage;
