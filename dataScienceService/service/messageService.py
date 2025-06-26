
from service.LLMService import LLMService
from utils.messageUtil import MessageFilter

class MessageService:
    def __init__(self):
        self.messageFilter = MessageFilter()
        self.llmService = LLMService()
    
    def process_message(self, message):
        if self.messageFilter.is_relevant_expense_sms(message):
            return self.llmService.runLLM(message)
        else:
            return None