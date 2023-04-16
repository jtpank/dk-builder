import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import '../styles/styles.css';
class DragAndDrop extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        
        }
      }
    render() {
        const mylists = ['todo', 'inProgress', "done"];
        return(
            <div className='splash-header'>
                {/* https://blog.logrocket.com/adding-drag-and-drop-functionality-with-react-beautiful-dnd/ */}
            <DragDropContext>  
                {/* <ListGrid>
                    {mylists.map((listKey) => (  
                        <List elements={elements[listKey]} key={listKey} prefix={listKey} />  
                    ))}
                </ListGrid>   */}
            </DragDropContext>

            </div>
    
        );
    }
}

export default DragAndDrop;