document.getElementById('quizForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Retrieve form data
    const workEnvironment = document.getElementById('workEnvironment').value.toLowerCase();
    const experience = parseInt(document.getElementById('experience').value, 10);
    const skills = document.getElementById('skills').value.split(',').map(skill => skill.trim().toLowerCase());
    const interests = document.getElementById('interests').value.split(',').map(interest => interest.trim().toLowerCase());
    const education = document.getElementById('education').value;

    // Fetch recommendations from backend
    fetch('/api/jobs')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }
            return response.json();
        })
        .then(data => {
            // Filter jobs based on user input
            const suitableJobs = data.filter(job => {
                const jobSkills = job.skills.map(skill => skill.toLowerCase());
                const jobInterests = job.interests.map(interest => interest.toLowerCase());
                return job.workEnvironment.toLowerCase().includes(workEnvironment) &&
                       job.experience <= experience &&
                       job.education.includes(education) &&
                       skills.every(skill => jobSkills.includes(skill)) &&
                       interests.every(interest => jobInterests.includes(interest));
            });

            // Display results
            displayJobs(suitableJobs);
        })
        .catch(error => {
            console.error('Error fetching jobs:', error);
            // Handle error in UI
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = '<p>Error fetching jobs. Please try again later.</p>';
        });
});

function displayJobs(jobs) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '<h2>Recommended Jobs</h2>';
    if (jobs.length === 0) {
        resultsContainer.innerHTML += '<p>No jobs match your criteria.</p>';
    } else {
        const jobList = document.createElement('ul');
        jobs.forEach(job => {
            const listItem = document.createElement('li');
            listItem.textContent = job.title;
            jobList.appendChild(listItem);
        });
        resultsContainer.appendChild(jobList);
    }
}
