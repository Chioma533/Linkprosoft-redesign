### USER(EMPLOYER) FLOW FROM ManageJobsPage TO PaymentScreen

# Goal
To ensure a smooth process, while the employer accepts an application and initializes the workflow with an initial escrow `simulated` deposit

 

# ARCHITECTURE/FLOW
- The Employer at [`src\pages\buyer\ManageJobsPage.jsx]` sees his latest posted job and then below he sees Offers(JobApplicants) from professionals that have applied for that particular job
- The Employer accepts one of the applications
- A confirmation popup modal appears showing professional's details and a Confirm button
- If 'Confirm' was selected, the Employer is redirected to the [`src\pages\buyer\PaymentScreen.jsx`] Note: {the professional is not contacted at this point}
- At the PaymentScreen, a payment summary is already prepared based on the professional's Quoted Price.The Employer confirms the amount and clicks the Pay to escrow button
- The employer is then redirected to a page where he selects his payment method(`simulated_for_now`)
- The Amount is deducted from the Employer's Funding Source and held in Escrow(`simulated_for_now`)
- Immediatedly payment is successful and confirmed, the Professional would be notified immediately => [`The professional's application should be updated to 'accepted' on his dashboard`]
- A success modal appears and shows `Escrow Funded Successfully 'Professional_Name' has been notified and can now begin work.`
- When the Employer the clicks `Go to Dashboard` on the success Modal, the employer is redirected to the `src\pages\employer\EmployerJobDetailsSubpage.jsx`
- The JobDetailsPage should display the Job with the status `In Progress` and also show that the `Escrow` has been funded.
- At this Point , the professional is notified that the `Escrow` has been funded and he can now begin work


- Meanwhile at the [`src\pages\buyer\ManageJobsPage.jsx`] page should be updated:
- The 'Job/Assignment' Tab that displayed the most recent Job Posted should be updated to whatever assignment/job that employer has not accepted an offer/professional for
- the 'Offers Tab' should be updated based on what has been updated in the 'Job/Assignment' Tab
