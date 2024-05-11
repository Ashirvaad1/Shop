from flask import Flask, request, jsonify
import requests
import base64
app=Flask(__name__)
repo_owner=Ashirvaad1
repo_name=Shop
file_path=Notices.txt
github_api_url=f'https://api.github.com/repos/{repo_owner}/{repo_name}/contents/{file_path}'
access_token=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
def authenticate():
    headers = {
        'Authorization': f'token {access_token}'
    }
    return headers
def get_file_contents():
    headers = authenticate()
    response = requests.get(github_api_url, headers=headers)
    if response.status_code == 200:
        file_content = response.json()['content']
        decoded_content = base64.b64decode(file_content).decode('utf-8')
        return decoded_content
    else:
        return None
def update_file_contents(new_content):
    headers = authenticate()
    current_content = get_file_contents()
    if current_content is not None:
        encoded_content = base64.b64encode(new_content.encode('utf-8')).decode('utf-8')
        data = {
            'message': 'Update file via API',
            'content': encoded_content,
            'sha': current_content['sha']
        }
        response = requests.put(github_api_url, json=data, headers=headers)
        return response.status_code
    else:
        return None
@app.route('/get-file', methods=['GET'])
def get_file():
    file_content = get_file_contents()
    if file_content is not None:
        return jsonify({'content': file_content}), 200
    else:
        return jsonify({'error': 'Failed to retrieve file contents'}), 500
@app.route('/update-file', methods=['POST'])
def update_file():
    data = request.get_json()
    new_content = data.get('content')
    if new_content:
        status_code = update_file_contents(new_content)
        if status_code == 200:
            return jsonify({'message': 'File updated successfully'}), 200
        else:
            return jsonify({'error': 'Failed to update file'}), 500
    else:
        return jsonify({'error': 'Content not provided'}), 400

if __name__ == '__main__':
    app.run(debug=True)
