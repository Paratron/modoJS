import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';

const propTypes = {};

const statusClasses = ['', 'mdo-uploading', 'mdo-upload-done', 'mdo-upload-error'];

const FileUploader = ({value, onChange, filename, targetURL = '', accept}) => {
	const classNames = ['mdo-fileUploader'];
	const [filenameBuffer, setFilenameBuffer] = useState(filename);
	const [uploadStatus, setUploadStatus] = useState(0);
	const [progress, setProgress] = useState(0);

	classNames.push(statusClasses[uploadStatus]);

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
			});

			xhr.addEventListener('error', (e) => {
				console.log(e);
				setUploadStatus(3);
			});

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
				enabled={uploadStatus === 0 || uploadStatus === 2}
			>
				Datei auswählen
			</Button>
			<span className="filename">{filenameBuffer}</span>
			<span className="progress">{progress}%</span>
			<input accept={accept} type="file" onChange={handleFileSelect}/>
		</div>
	);
};

FileUploader.propTypes = propTypes;

export default FileUploader;
