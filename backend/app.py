# backend/app.py
from flask import Flask
from flask_cors import CORS
import time
from config import blocks_collection
from blockchain.block import Block
from blockchain.chain import Blockchain
from routes.voting import voting_blueprint, blockchain_engine

app = Flask(__name__)
CORS(app)

# Register the Blueprint routers
app.register_blueprint(voting_blueprint)

def initialize_genesis_block():
    if blocks_collection is not None and blocks_collection.count_documents({}) == 0:
        genesis_block = Block(0, time.time(), [{"info": "Genesis Block - Election Opened"}], "0")
        blockchain_engine.proof_of_work(genesis_block)
        blocks_collection.insert_one(genesis_block.__dict__)
        print("📦 Genesis Block successfully forged in MongoDB Atlas cloud ledger!")

if __name__ == '__main__':
    initialize_genesis_block()
    app.run(debug=True, port=5000)
