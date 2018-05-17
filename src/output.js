const email = (earlistDate, emailTo, emailFrom) => ({
  emailFrom,
  emailTo,
  subject: `Driving Test Available - ${earlistDate}`,
  html: `
    <h1>New Driving Test Available!</h1>
    <p>New available date: <b>${earlistDate}</b></p>
    <a href="https://www.gov.uk/change-driving-test">Book Now!</a>
  `
});

const notification = earlistDate => ({
  title: 'Driving Test Available!',
  message: earlistDate,
  sound: 'Glass'
});

module.exports = { email, notification };
