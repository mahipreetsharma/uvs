# Universal Voting System — Project Explanation

## 1. What is a Universal Voting System?

A Universal Voting System is a digital platform designed to allow eligible voters to participate in elections electronically instead of relying entirely on traditional paper-based voting.

The system can be adapted for different types of elections, such as:

- College and university elections
- Student council elections
- Organizational and employee elections
- Club and association elections
- Community elections

The main objective is to make the election process more accessible, transparent, efficient, and auditable, while protecting voter privacy and preventing unauthorized or duplicate votes.

In your project, the Universal Voting System is implemented as a Decentralised E-Voting System Using a Custom Blockchain Architecture.

## 2. How does the system work?

Step 1: Voter Registration

The administrator registers eligible voters before the election.

Step 2: Authentication

The voter logs in with registered credentials.

Step 3: Candidate Selection

The voter reviews the candidates and chooses one.

Step 4: Vote Submission

The backend checks eligibility, election status, and whether the voter has already voted.

Step 5: Blockchain Recording

The accepted vote record is committed to the custom blockchain using hashing and on-demand Proof of Work.

Step 6: Election Audit

The system validates block hashes and ledger links before the final tally is approved.

Step 7: Results Publication

The final results are published for authorized viewing.

## 3. Main users of the system

[Election Coordinator Carefully Checks Voter Registration Data](https://images.openai.com/static-rsc-4/zq0Aitv0lKpIJaS3GBm_nWj2r-7kO9cV8WiNYOAGve8bMMdtliMGljCEuyGd6FeZtxOP-djgDjQpcjvOEMAIZXLwFJL6h4n_MMvAs1BD8ELVM9nSv4J5PhUq5c8LMyimVvvH4iE06eum91Y9vSPMoj7LY9shwQOByiKHS6MSq81Y80M4pOlPqgCaMxK69GHl?purpose=inline)

Administrator

- Registers eligible voters.
- Adds and manages candidates.
- Starts and closes elections.
- Triggers blockchain mining.
- Audits blockchain integrity.
- Publishes the final results.

[Is digital voting secure enough for national elections? | Kaspersky official blog](https://images.openai.com/static-rsc-4/0eCUqH6FtcCBJyWZ2vQt12cSPc3Cp1u-0zRKjix5ZrZ5vpQJxgn_mJQCnSHH0w22_IgZXnrUaLgIl5X0KSNmTl4qZ7F_vSO7kJp3OkUiJaEPYZm6SbDW_Xn7xpSGNmW9OCCnKvaIXFngPfFtnzCE2tCQ5pEene3WBaDWNcNEtxA?purpose=inline)

Registered voter

- Logs in securely.
- Views the candidate list.
- Casts a vote during the permitted period.
- Receives confirmation of successful submission.
- Checks election status and published results.

## 4. Technologies used in your project

| Technology            | How it is used                                                                         |
| --------------------- | -------------------------------------------------------------------------------------- |
| React.js              | Builds the user interface and dashboards.                                              |
| Python                | Implements the backend logic and blockchain engine.                                    |
| Flask                 | Provides APIs for authentication, candidates, voting, and election management.         |
| MongoDB               | Stores user accounts, candidate information, election data, and blockchain records.    |
| SHA-256               | Generates hashes to help detect changes to block contents.                             |
| Custom Proof of Work  | Requires computational work to produce a block hash meeting the configured difficulty. |
| JSON Web Tokens (JWT) | Supports authenticated API requests.                                                   |
| Blockchain explorer   | Displays blocks and their integrity-related information.                               |

Your architecture uses pre-registered voters and on-demand mining. This means voters are approved before participating, and blocks are mined when the application triggers the operation rather than through continuous mining.

## 5. Why use blockchain in a voting system?

In a conventional centralized voting application, vote records may be stored in a database controlled by a single organization. If that database is improperly modified, the changes might be difficult to detect.

A blockchain-style ledger can help address this issue.

Linked blocks

Each block contains the hash of the previous block, creating a verifiable sequence.

Tamper detection

If stored block contents change, recalculated hashes can reveal inconsistencies.

Auditability

An authorized auditor can validate block order, hashes, and the recorded election history.

Double-voting prevention

Backend validation and database constraints can ensure each eligible voter casts no more than one accepted vote.

Important limitation: Blockchain does not automatically guarantee that an election is fair, anonymous, or secure. Your custom implementation must also protect voter identity, secure the voting process, control administrative privileges, and support independent verification. A blockchain running on one server is not fully decentralised merely because it uses linked blocks.

## 6. Example use case

Imagine a college conducting a student council election.

1. The college administrator registers 500 eligible students.
2. The administrator adds three candidates.
3. Voting opens at the scheduled time.
4. A registered student logs in and selects one candidate.
5. The system verifies the student's eligibility and checks that they have not already voted.
6. The accepted vote is recorded and committed to the blockchain according to the mining policy.
7. After voting closes, the system validates the ledger and tallies the accepted votes.
8. The administrator publishes the results, and students can view the winning candidate.

For example, if the validated tally is 210 votes for Candidate A, 175 for Candidate B, and 115 for Candidate C, Candidate A wins with the highest vote count. These figures are illustrative, not actual election results.

## 7. What makes your project different?

The key feature of your project is that you are building your own blockchain engine instead of relying on an existing enterprise blockchain framework.

Your Python implementation will define:

- The structure of each block
- SHA-256 hash calculation
- Previous-block hash linking
- Custom Proof of Work mining
- Blockchain integrity validation
- MongoDB persistence
- The integration between voting and ledger recording

This makes the project useful for demonstrating object-oriented programming, web development, database design, cryptography, and blockchain fundamentals.

## 8. Project objective in one paragraph

The objective of the Universal Voting System is to develop a web-based electronic voting platform that enables eligible voters to participate in elections through a secure and accessible interface. The system uses React.js, Flask, Python, and MongoDB, together with a custom blockchain engine based on SHA-256 hashing and Proof of Work, to provide verifiable vote records, prevent duplicate voting, maintain an auditable election history, and publish results after the election is closed and validated.

In simple terms: Your project allows people to vote online, uses backend rules to control who can vote and when, and uses a custom blockchain ledger to help make changes to recorded election data detectable.