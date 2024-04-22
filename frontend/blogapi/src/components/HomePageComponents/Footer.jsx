import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

const footers = [
    {
        title: 'Company',
        description: ['Team', 'History', 'Contact us', 'Locations'],
    },
    {
        title: 'Features',
        description: [
            'Cool stuff',
            'Random feature',
            'Team feature',
            'Developer stuff',
            'Another one',
        ],
    },
    {
        title: 'Resources',
        description: [
            'Resource',
            'Resource name',
            'Another resource',
            'Final resource',
        ],
    },
    {
        title: 'Legal',
        description: ['Privacy policy', 'Terms of use'],
    },
];

function Footer() {
    return (
        <Container maxWidth="md" component="footer" sx={{ borderTop: '1px solid #ddd', marginTop: 8, paddingTop: 3, paddingBottom: 3, marginLeft: 'auto', marginRight: 'auto'}}>
            <div>
            <Grid container spacing={4} justifyContent="space-evenly">
                {footers.map((footer) => (
                    <Grid item xs={6} sm={3}>
                        <Typography variant="h6" color="textPrimary" gutterBottom sx={{ marginLeft: '36px' }}>
    {footer.title}
</Typography>

                        <ul sx={{ listStyleType: 'none', paddingInlineStart: 0 }}>
                            {footer.description.map((item) => (
                                <li key={item}>
                                    <Link href="#" variant="subtitle1" sx={{ textDecoration: 'none', color: 'text.secondary'}}>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Grid>
                ))}
            </Grid>
            <Box mt={5}>
                <Typography variant="body2" color="textSecondary" align="center">
                    {'Copyright '}
                    NutriMix
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </Box>
            </div>
    
        </Container>
    );
}

export default Footer;
