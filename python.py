from flask import Flask, request, jsonify
import requests
import base64
import os
app = Flask(__name__)
repo_owner = 'Ashirvaad1'
repo_name = 'Shop'
file_path = '/Notices.txt'
github_api_url = f'https://api.github.com/repos/{repo_owner}/{repo_name}/contents/{file_path}'
access_token = os.getenv('GITHUB_ACCESS_TOKEN')
def authenticate():
    headers = {
        'Authorization': f'token {access_token}'
    }
    return headers
def get_file_contents():
    headers = authenticate()
    response = requests.get(github_api_url, headers=headers)
    if response.status_code == 200:
        content_data = response.json()
        file_content = content_data['content']
        decoded_content = base64.b64decode(file_content).decode('utf-8')
        return decoded_content, content_data['sha']
    else:
        print(f"Error fetching file: {response.status_code}, {response.json()}")
        return None, None
def update_file_contents(new_content, sha):
    headers = authenticate()
    encoded_content = base64.b64encode(new_content.encode('utf-8')).decode('utf-8')
    data = {
        'message': 'Update file via API',
        'content': encoded_content,
        'sha': sha
    }
    response = requests.put(github_api_url, json=data, headers=headers)
    return response
@app.route('/get-file', methods=['GET'])
def get_file():
    file_content, sha = get_file_contents()
    if file_content is not None:
        return jsonify({'content': file_content}), 200
    else:
        return jsonify({'error': 'Failed to retrieve file contents'}), 500
@app.route('/update-file', methods=['POST'])
def update_file():
    data = request.get_json()
    new_content = data.get('content')
    if new_content:
        current_content, sha = get_file_contents()
        if current_content is not None and sha is not None:
            response = update_file_contents(new_content, sha)
            if response.status_code == 200:
                return jsonify({'message': 'File updated successfully'}), 200
            else:
                print(f"Error updating file: {response.status_code}, {response.json()}")
                return jsonify({'error': 'Failed to update file'}), 500
        else:
            return jsonify({'error': 'Failed to fetch current file content'}), 500
    else:
        return jsonify({'error': 'Content not provided'}), 400
if __name__ == '__main__':
    app.run(debug=True)
