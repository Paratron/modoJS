import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';

const propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
	filename: PropTypes.string,
	targetURL: PropTypes.string,
	accept: PropTypes.string,
	enabled: PropTypes.bool,
	onBeforeUpload: PropTypes.func,
	onAfterUpload: PropTypes.func,
};

const defaultProps = {
	enabled: true
};

const statusClasses = ['', 'mdo-uploading', 'mdo-upload-done', 'mdo-upload-error'];

const FileUploader = ({value, onChange, filename, targetURL = '', accept, enabled, onBeforeUpload, onAfterUpload}) => {
	const classNames = ['mdo-fileUploader'];
	const [filenameBuffer, setFilenameBuffer] = useState(filename);
	const [uploadStatus, setUploadStatus] = useState(0);
	const [progress, setProgress] = useState(0);

	classNames.push(statusClasses[uploadStatus]);

	if(!enabled){
		classNames.push('mdo-disabled');
	}

	const handleFileSelect = (e) => {
		const files = e.target.files;

		if (files.length) {
			const file = files[0];
			const formData = new FormData();
			formData.append('file', file, file.name);

			setFilenameBuffer(file.name);
			setProgress(0);

			const xhr = new XMLHttpRequest();
			xhr.upload.addEventListener('progress', (e) => {
				setProgress(Math.round((e.loaded / e.total) * 100));
			});

			xhr.addEventListener('load', () => {
				setUploadStatus(2);
				setTimeout(() => setUploadStatus(0), 2000);
				if(onAfterUpload){
					onAfterUpload(xhr.responseText);
				}
			});

			xhr.addEventListener('error', (e) => {
				console.log(e);
				setUploadStatus(3);
			});

			if(onBeforeUpload){
				onBeforeUpload();
			}

			xhr.open('POST', targetURL, true);
			xhr.send(formData);
			setUploadStatus(1);
		}
	};

	return (
		<div className={classNames.join(' ')}>
			<Button
				type={Button.TYPES.PRIMARY}
				icon="cloud_upload"
				enabled={enabled && (uploadStatus === 0 || uploadStatus === 2)}
			>
				Datei auswählen
			</Button>
			<span className="filename">{filenameBuffer}</span>
			<span className="progress">{progress}%</span>
			{enabled && <input accept={accept} type="file" onChange={handleFileSelect}/>}
		</div>
	);
};

FileUploader.propTypes = propTypes;
FileUploader.defaultProps = defaultProps;

export default FileUploader;
