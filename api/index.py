from flask import Flask, jsonify, request
import json

app = Flask(__name__)

# Deadlock detection simulation
def detect_deadlock(allocation_matrix, request_matrix, available_resources):
    """
    Implements deadlock detection algorithm using resource allocation graph
    
    Parameters:
    allocation_matrix: 2D array where allocation_matrix[i][j] is the amount of resource j allocated to process i
    request_matrix: 2D array where request_matrix[i][j] is the amount of resource j requested by process i
    available_resources: Array of available resources
    
    Returns:
    tuple: (is_deadlock, deadlocked_processes)
    """
    num_processes = len(allocation_matrix)
    num_resources = len(available_resources)
    
    # Initialize work and finish arrays
    work = available_resources.copy()
    finish = [False] * num_processes
    
    # Find an unfinished process that can have its requests satisfied
    while True:
        found = False
        for i in range(num_processes):
            if not finish[i]:
                # Check if all requests can be satisfied
                can_allocate = True
                for j in range(num_resources):
                    if request_matrix[i][j] > work[j]:
                        can_allocate = False
                        break
                
                if can_allocate:
                    # Process can complete, release its resources
                    found = True
                    finish[i] = True
                    for j in range(num_resources):
                        work[j] += allocation_matrix[i][j]
        
        if not found:
            break
    
    # Check if all processes are finished
    deadlocked = not all(finish)
    deadlocked_processes = [i for i in range(num_processes) if not finish[i]]
    
    return (deadlocked, deadlocked_processes)

# Banker's algorithm for deadlock avoidance
def bankers_algorithm(allocation, max_need, available):
    """
    Implements Banker's algorithm for deadlock avoidance
    
    Parameters:
    allocation: 2D array where allocation[i][j] is the amount of resource j allocated to process i
    max_need: 2D array where max_need[i][j] is the maximum amount of resource j that process i may need
    available: Array of available resources
    
    Returns:
    tuple: (is_safe, safe_sequence)
    """
    num_processes = len(allocation)
    num_resources = len(available)
    
    # Calculate need matrix
    need = []
    for i in range(num_processes):
        process_need = []
        for j in range(num_resources):
            process_need.append(max_need[i][j] - allocation[i][j])
        need.append(process_need)
    
    # Initialize work and finish arrays
    work = available.copy()
    finish = [False] * num_processes
    safe_sequence = []
    
    # Find a safe sequence
    while len(safe_sequence) < num_processes:
        found = False
        for i in range(num_processes):
            if not finish[i]:
                # Check if all needs can be satisfied
                can_allocate = True
                for j in range(num_resources):
                    if need[i][j] > work[j]:
                        can_allocate = False
                        break
                
                if can_allocate:
                    # Process can complete, add to safe sequence
                    found = True
                    finish[i] = True
                    safe_sequence.append(i)
                    for j in range(num_resources):
                        work[j] += allocation[i][j]
        
        if not found:
            break
    
    # Check if all processes are in the safe sequence
    is_safe = len(safe_sequence) == num_processes
    
    return (is_safe, safe_sequence)

@app.route('/api/detection', methods=['POST'])
def deadlock_detection():
    data = request.json
    allocation_matrix = data.get('allocation', [])
    request_matrix = data.get('request', [])
    available_resources = data.get('available', [])
    
    is_deadlock, deadlocked_processes = detect_deadlock(
        allocation_matrix, request_matrix, available_resources
    )
    
    return jsonify({
        'is_deadlock': is_deadlock,
        'deadlocked_processes': deadlocked_processes
    })

@app.route('/api/avoidance', methods=['POST'])
def deadlock_avoidance():
    data = request.json
    allocation = data.get('allocation', [])
    max_need = data.get('max', [])
    available = data.get('available', [])
    
    is_safe, safe_sequence = bankers_algorithm(
        allocation, max_need, available
    )
    
    return jsonify({
        'is_safe': is_safe,
        'safe_sequence': safe_sequence
    })

@app.route('/api/hello', methods=['GET'])
def hello_world():
    return jsonify({
        'message': 'Hello from the Deadlock Simulation API!',
        'status': 'success'
    })

if __name__ == '__main__':
    app.run(port=5328)
