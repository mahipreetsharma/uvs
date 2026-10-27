# backend/routes/voting.py
from flask import Blueprint, request, jsonify
import time
from blockchain.block import Block
from blockchain.chain import Blockchain

voting_blueprint = Blueprint('voting', __name__)
blockchain_engine = Blockchain()

# 🛠️ THE FIX: Dynamically import collections inside functions so the server doesn't crash on startup!
def get_collections():
    import config
    return config.blocks_collection, config.voters_collection

@voting_blueprint.route('/get_chain', methods=['GET'])
def get_chain():
    blocks_collection, _ = get_collections()
    if blocks_collection is None:
        return jsonify({"error": "Cloud database is currently offline. Check your .env credentials."}), 500
        
    chain = list(blocks_collection.find({}, {"_id": 0}))
    is_valid = blockchain_engine.is_chain_valid(chain)
    return jsonify({"chain": chain, "length": len(chain), "is_valid": is_valid}), 200

@voting_blueprint.route('/add_vote', methods=['POST'])
def add_vote():
    blocks_collection, voters_collection = get_collections()
    if blocks_collection is None or voters_collection is None:
        return jsonify({"error": "Cloud database is currently offline."}), 500
        
    data = request.get_json()
    voter_id = data.get('voter_id')
    candidate_id = data.get('candidate_id')

    if not voter_id or not candidate_id:
        return jsonify({"error": "Missing parameters"}), 400

    if voters_collection.find_one({"voter_id": voter_id}):
        return jsonify({"error": "Security Alert: Duplicate ballot attempt blocked."}), 400

    vote_entry = {"voter_id": voter_id, "candidate_id": candidate_id, "timestamp": time.time()}
    blockchain_engine.unmined_votes.append(vote_entry)
    voters_collection.insert_one({"voter_id": voter_id, "timestamp": time.time()})

    return jsonify({"message": "Vote verified and added to pool."}), 201

@voting_blueprint.route('/mine', methods=['GET'])
def mine_block():
    blocks_collection, _ = get_collections()
    if blocks_collection is None:
        return jsonify({"error": "Cloud database is currently offline."}), 500
    if not blockchain_engine.unmined_votes:
        return jsonify({"message": "No unmined votes present in the pool."}), 400

    last_block_list = list(blocks_collection.find({}, {"_id": 0}).sort("index", -1).limit(1))
    if not last_block_list:
        return jsonify({"error": "Ledger out of sync: Genesis block missing."}), 500
    
    last_block_doc = last_block_list[0]
    
    new_block = Block(
        index=last_block_doc['index'] + 1,
        timestamp=time.time(),
        votes=blockchain_engine.unmined_votes,
        previous_hash=last_block_doc['hash']
    )

    mined_block = blockchain_engine.proof_of_work(new_block)
    blocks_collection.insert_one(mined_block.__dict__)
    blockchain_engine.unmined_votes = []

    return jsonify({
        "message": "Block successfully forged and linked.",
        "block": {"index": mined_block.index, "hash": mined_block.hash}
    }), 200
