import React from 'react';

function Dashboard() {
    const styles = {
        container: {
            fontFamily: 'Arial, sans-serif',
            maxWidth: '1500px',
            margin: '0 auto',
            padding: '0 5px',
        },
        header: {
            textAlign: 'left',
            fontSize: '27px',
            margin: '0',
            padding: '15px 0',
        },
        gifContainer: {
            display: 'flex',
            justifyContent: 'center',
            margin: '20px 0',
        },
        gif: {
            maxWidth: '500px',
            width: '100%',
            height: 'auto',
        },
        infoSection: {
            textAlign: 'left',
            marginBottom: '20px',
        },
        sectionTitle: {
            fontSize: '18px',
            color: '#007bff',
            marginBottom: '10px',
        },
        sectionContent: {
            fontSize: '16px',
            lineHeight: '1.6',
            position: 'relative',
            paddingLeft: '35px',
            marginBottom: '10px',
        },
        numberCircle: {
            position: 'absolute',
            left: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '50%',
            width: '25px',
            height: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.8rem',
        },
    };

    const infoSections = [
        {
            title: "Datasets",
            steps: [
                "Navigate to the 'Datasets' tab to fetch existing datasets",
                "It is also possible to upload your own dataset."
            ]
        },
        {
            title: "Models",
            steps: [
                "Visit the 'Models' tab to browse available models.",
                "Install the model you want to use.",
                "Get results from the model you choose by associating it with your datasets."
            ]
        },
        {
            title: "Evaluations",
            steps: [
                "Go to 'Evaluations' to see the output of the models.",
                "You can either view the results side by side or download them."
            ]
        }
    ];

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Dashboard</h1>
            <div style={styles.gifContainer}>
                <img src="/nerf_video.gif" alt="Dashboard Animation" style={styles.gif} />
            </div>
            {infoSections.map((section, index) => (
                <div key={index} style={styles.infoSection}>
                    <h2 style={styles.sectionTitle}>{section.title}</h2>
                    {section.steps.map((step, stepIndex) => (
                        <p key={stepIndex} style={styles.sectionContent}>
                            <span style={styles.numberCircle}>{stepIndex + 1}</span>
                            {step}
                        </p>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Dashboard;
