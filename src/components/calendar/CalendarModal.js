import React, { useEffect, useState } from 'react';
import moment from 'moment';

import Modal from 'react-modal';
import Swal from 'sweetalert2';
// import DateTimePicker from 'react-datetime-picker';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from  "react-datepicker";
import es from 'date-fns/locale/es';
import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdate } from '../../actions/events';

registerLocale('es', es);



const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
};
Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1,'hours');
const nowPlus1 = now.clone().add(1,'hours');
const initEvent = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: nowPlus1.toDate()
}

export const CalendarModal = () => {

    const { modalOpen } = useSelector( state => state.ui );
    const { activeEvent } = useSelector( state => state.calendar );
    const dispatch = useDispatch();

    const [dateStart, setDateStart] = useState( now.toDate() );
    const [dateEnd, setDateEnd] = useState( nowPlus1.toDate() );
    
    const [formValues, setFormValues] = useState(initEvent);
    const { notes, title, start, end } = formValues;
    // const [titleValid, setTitleValid] = useState(true);

    useEffect(() => {
        
        if ( activeEvent ) {
            setFormValues( activeEvent );
        } else {
            setFormValues( initEvent );
        }
        
    }, [activeEvent, setFormValues])




    const handleInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const closeModal = () => {
        dispatch( uiCloseModal() );
        dispatch( eventClearActiveEvent() );
        setFormValues(initEvent);
    }

    const handleStartDateChange = ( e ) => {
        setDateStart(e);
        setFormValues({
            ...formValues,
            start: e
        })
    }

    const handleEndDateChange = ( e ) => {
        setDateEnd(e);
        setFormValues({
            ...formValues,
            end: e
        })
    }

    const handleSubmitForm = (e) => {
        e.preventDefault();

        const momentStart = moment( start );
        const momentEnd = moment( end );

        if ( momentStart.isSameOrAfter( momentEnd ) ) {
            return Swal.fire('Error', 'La hora final debe de ser mayor a la hora de inicio', 'error');
        }

        if ( title.trim().length < 2 ) {
            // return setTitleValid(false);
            return Swal.fire('Error', 'El título no puede estar vacío o con menos de 2 caracteres', 'error');
        }

        if ( activeEvent ) {
            dispatch( eventStartUpdate( formValues ) );
        } else {
            dispatch( eventStartAddNew( formValues ) );
        }
        //TODO: realizar grabación en base de datos.
        // setTitleValid(true);
        closeModal();
    }

    return (
        <Modal
            isOpen={ modalOpen }
            onRequestClose={ closeModal }
            style={ customStyles }
            closeTimeoutMS={ 200 }
            className="modal"
            overlayClassName="modal-fondo"
        >

        <h1> { (activeEvent) ? 'Editar evento' : 'Nuevo evento'} </h1>
        <hr />
        <form 
            className="container"
            onSubmit={ handleSubmitForm }
        >

            <div className="form-group">
                <label>Fecha y hora inicio </label>
                <DatePicker
                    locale="es"
                    selected={ dateStart }
                    onChange={ handleStartDateChange }
                    className="form-control ml-2"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={20}
                    timeCaption="time"
                    dateFormat="MMM d, yyyy h:mm aa"
                />
                
                {/* <DateTimePicker
                    onChange={ handleStartDateChange }
                    value={ dateStart }
                    className="form-control"
                /> */}

            </div>

            <div className="form-group">
                <label>Fecha y hora fin </label>
                <DatePicker
                    locale="es"
                    selected={ dateEnd }
                    onChange={ handleEndDateChange }
                    className="form-control ml-2"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={20}
                    timeCaption="time"
                    dateFormat="MMM d, yyyy h:mm aa"
                    minDate={ dateStart }
                />

                {/* <DateTimePicker
                    onChange={ handleEndDateChange }
                    value={ dateEnd }
                    minDate={ dateStart }
                    className="form-control"
                /> */}
            </div>

            <hr />
            <div className="form-group">
                <label>Titulo y notas</label>
                <input 
                    type="text" 
                    // className={`form-control ${ !titleValid && 'is-invalid'}`}
                    className="form-control"
                    placeholder="Título del evento"
                    name="title"
                    autoComplete="off"
                    value={ title }
                    onChange={ handleInputChange }
                />
                <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
            </div>

            <div className="form-group">
                <textarea 
                    type="text" 
                    className="form-control"
                    placeholder="Notas"
                    rows="5"
                    name="notes"
                    value={ notes }
                    onChange={ handleInputChange }
                ></textarea>
                <small id="emailHelp" className="form-text text-muted">Información adicional</small>
            </div>

            <button
                type="submit"
                className="btn btn-outline-primary btn-block"
            >
                <i className="far fa-save"></i>
                <span> Guardar</span>
            </button>

        </form>

        </Modal>
    )
}
