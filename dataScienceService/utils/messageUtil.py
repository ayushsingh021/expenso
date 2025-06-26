import re

class MessageFilter:
    def __init__(self):
        # Define keywords that typically appear in expense-related SMS messages
        self.expense_keywords = [
            "debited", "spent", "txn", "transaction", "purchase", "withdrawn",
            "card", "a/c", "ac", "account", "bank",
            "upi", "to", "via", "gpay", "paytm", "phonepe",
            "ref no", "ref#", "ref.", "transaction id", "utr", "vpa"
        ]
        self.expense_pattern = re.compile(
            r'\b(?:' + '|'.join(re.escape(kw) for kw in self.expense_keywords) + r')\b',
            flags=re.IGNORECASE
        )

    def is_relevant_expense_sms(self, message: str) -> bool:
        """
        Returns True if the message is likely to be a bank or UPI debit transaction and not an OTP or login alert.
        """
        message_lower = message.lower()

        # Common OTP/login keywords
        otp_patterns = [
            r"\botp\b", r"\bone time password\b", r"\blogin\b", r"\bdo not share\b",
            r"\byour.*otp\b", r"\buse.*otp\b"
        ]
        if any(re.search(pattern, message_lower) for pattern in otp_patterns):
            return False

        # Expense-related keywords
        return bool(self.expense_pattern.search(message))

