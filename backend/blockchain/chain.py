# backend/blockchain/chain.py
from blockchain.block import Block

class Blockchain:
    def __init__(self):
        self.unmined_votes = []
        self.difficulty = 3

    def proof_of_work(self, block):
        target_prefix = "0" * self.difficulty
        while not block.hash.startswith(target_prefix):
            block.nonce += 1
            block.hash = block.calculate_hash()
        return block

    def is_chain_valid(self, chain_from_db):
        for i in range(1, len(chain_from_db)):
            current = chain_from_db[i]
            previous = chain_from_db[i-1]

            recalculated_hash = Block(
                current['index'], current['timestamp'], current['votes'], 
                current['previous_hash'], current['nonce']
            ).calculate_hash()

            if current['hash'] != recalculated_hash:
                return False
            if current['previous_hash'] != previous['hash']:
                return False
        return True
