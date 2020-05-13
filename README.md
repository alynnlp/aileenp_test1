# Microservice API

## Installation

Install node v12.14.10 and above

```bash
npm install
npm run build

# Use to rebuild on change
npm run watch
```

## Usage

```bash
npm run start
```

## Testing

```

# Fix lint auto
npm run lint:fix
```

## Lint

```
# Lint code with Eslint
npm run lint

# Run lint on any file change
npm run lint:watch
```

## Logging

Winston logging library is used for logging.

### API logging

Logs detailed info about each api request to console, log file and google metrics during development.

### Error logging

## Logs stack trace of the error to console along with other details. You should ideally store all error messages persistently.

---

In finance, it's common for accounts to have so-called "velocity limits". In this task, you'll write a program that accepts or declines attempts to load funds into customers' accounts in real-time.

Each attempt to load funds will come as a single-line JSON payload, structured as follows:

```json
{
  "id": "1234",
  "customer_id": "1234",
  "load_amount": "$123.45",
  "time": "2018-01-01T00:00:00Z"
}
```

Each customer is subject to three limits:

- A maximum of \$5,000 can be loaded per day
- A maximum of \$20,000 can be loaded per week
- A maximum of 3 loads can be performed per day, regardless of amount

As such, a user attempting to load $3,000 twice in one day would be declined on the second attempt, as would a user attempting to load $400 four times in a day.

For each load attempt, you should return a JSON response indicating whether the fund load was accepted based on the user's activity, with the structure:

```json
{ "id": "1234", "customer_id": "1234", "accepted": true }
```

You can assume that the input arrives in ascending chronological order and that if a load ID is observed more than once for a particular user, all but the first instance can be ignored. Each day is considered to end at midnight UTC, and weeks start on Monday (i.e. one second after 23:59:59 on Sunday).

Your program should process lines from `input.txt` and return output in the format specified above, either to standard output or a file. Expected output given our input data can be found in `output.txt`.

You're welcome to write your program in a general-purpose language of your choosing, but as we use Go we do have a preference towards solutions written in it.

We value well-structured, self-documenting code with sensible test coverage. Descriptive function and variable names are appreciated, as is isolating your business logic from the rest of your code.
