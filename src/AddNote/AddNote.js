import React from "react";
import ApiContext from "../ApiContext";
import NotefulForm from "../NotefulForm/NotefulForm";
import config from '../config'
import uuidv4 from 'uuid/v4';

import './AddNote.css'

export default class AddNote extends React.Component {
  state = {
    noteName: { value: "", touched: false },
    content: { value: "", touched: false },
    folderid: { value: "", empty: false }
  };

  setNoteName = name => {
    this.setState({ noteName: { value: name, touched: true } });
  };

  setContent = content => {
    this.setState({ content: { value: content, touched: true } });
  };

  setFolderId = folderid => {
    this.setState({ folderid: { value: folderid } });
  };

  static contextType = ApiContext;

  handleFormSubmit(event) {
    event.preventDefault();
    if(this.state.folderid.value.length <= 0) {
      this.setState({
        folderid: {
          value: '',
          empty: true
        }
      })
      return false
    }

    let note = {
        id: uuidv4(),
        name: this.state.noteName.value,
        modified: new Date().toISOString(),
        content: this.state.content.value,
        folderid: this.state.folderid.value
    }

    fetch(`${config.API_ENDPOINT}/api/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(note)
    })
    .then(resp => {
        if(!resp.ok) {
            return resp.json().then(e => Promise.reject(e));
        }
        return resp.json();
    })
    .then(() => {
        this.context.addNote(note);

        this.props.history.goBack();
    })
    .catch(error => {
        console.log({ error });
    })
  }

  validateName = () => {
    let name = this.state.noteName.value;
    if (name.length <= 0) {
      return "Name must not be blank";
    }
  }

  validateFolder = () => {
    let name = this.state.folderid.value;
    if (name.length <= 0) {
      return "Please select a folder";
    }
  }

  validateContent = () => {
    let name = this.state.content.value;
    if (name.length <= 0) {
      return "Content cannot be blank";
    }
  }

  render() {
    return (
      <section className="AddNote-container">
        <h2>Add New Note</h2>
        <NotefulForm
          className="AddNote"
          onSubmit={event => this.handleFormSubmit(event)}
        >
          <label htmlFor="note-name">
            Note Name
            {this.state.noteName.touched && 
                <p className="error">{this.validateName()}</p>}
          </label>
          <input
            id="note-name"
            type="text"
            placeholder="New Note"
            value={this.state.noteName.value}
            onChange={e => this.setNoteName(e.target.value)}
          />
          <label htmlFor="folderSelect">
              Folder
              {this.state.folderid.empty && 
              <p className="error">{this.validateFolder()}</p>}  
          </label>
          <select onChange={e => this.setFolderId(e.target.value)} id="folderSelect">
            <option value=''>Select A Folder</option>
            {this.context.folders.map( folder => <option value={folder.id}>{folder.name}</option>)}
          </select>
          <label htmlFor="content">
              Content
              {this.state.content.touched && 
              <p className="error">{this.validateContent()}</p>}
          </label>
          <textarea onChange={e => this.setContent(e.target.value)} id="content" value={this.state.content.value} placeholder="DUDE your content goes here."></textarea>
          <button type="submit" disabled={this.validateName() || this.validateContent()}>Submit Note</button>
        </NotefulForm>
      </section>
    );
  }
}