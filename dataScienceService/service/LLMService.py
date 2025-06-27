from typing import Optional
import os
from pydantic import BaseModel, Field  # ✅ Fixed import
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_mistralai import ChatMistralAI
from service.Expense import Expense
from langchain_core.utils.function_calling import convert_to_openai_tool
from dotenv import load_dotenv

class LLMService:
    def __init__(self):
        load_dotenv()
        self.prompt = ChatPromptTemplate.from_messages(
            [
        (
            "system",
            (
                "You are an expert extraction algorithm. "
                "Only extract relevant information from the text. "
                "If you do not know the value of an attribute asked to extract, return null for the attribute's value. "
                "The amount should only contain numerical values and no currency symbols or words. "
                "Return the amount in INR if the currency is not specified. "
                "If you do know the value of category of payment asked to extract, "
                "return one of: food, transport, housing, health, shopping, entertainment, education, travel, bills, finance, personal_care. "
                "If you do not know the category of payment, return 'miscellaneous' for the category."
            ),
        ),
        ("human", "{text}"),
    ]
        )
        self.apiKey = os.getenv('MISTRALAI_API_KEY')
        self.llm = ChatMistralAI(api_key=self.apiKey, model="mistral-large-latest", temperature=0)
        self.runnable = self.prompt | self.llm.with_structured_output(schema=Expense)

    def runLLM(self, message):
        
        return self.runnable.invoke({"text": message})
