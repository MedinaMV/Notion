import React from 'react';
import { Grid } from "@mui/material";
import SharedNoteComponent from "../SharedNoteComponent";
import { useLocation } from 'react-router-dom';
import URL from '../../api/api-calls';

export default function SharedCollections() {
    const [collections, setCollections] = React.useState([]);
    const location = useLocation();

    React.useEffect(() => {
        (async () => {
            const request = await fetch(URL + `/collection/getSharedCollections/${location.state.friend}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const response = await request.json();
            console.log(response.collections);
            setCollections(response.collections ?? []);
        })();
    }, []);

    return (
        <Grid style={{ margin: "30px 210px" }}>
            <h1>Shared Collections</h1>
            <Grid>
                {collections.map(collection => (
                    <SharedNoteComponent
                        key={collection._id}
                        title={collection.name}
                        noteId={collection._id}
                        type={"Collection"}
                    />
                ))}
            </Grid>
        </Grid>
    );
}