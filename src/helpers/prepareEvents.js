import moment from 'moment'

export const prepareEvents = ( events = [] ) => {

    return events.map( 
        ( evento ) => ({
            ...evento,
            end: moment( evento.end ).toDate(),
            start: moment( evento.start ).toDate(),
        })
    );
    
}

