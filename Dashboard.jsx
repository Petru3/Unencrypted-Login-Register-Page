/* eslint-disable no-unused-vars */

import { useReducer, useEffect } from 'react';

const PROJECT_CREATE = 'project/create';
const PROJECT_UPDATE = 'project/update'
const PROJECT_DELETE = 'project/delete';
const STATUS_TOGGLE = 'status/toggle';
const SET_PROJECTS = 'set/projects';
const UPDATE_FIELD = 'update/field';

const initialState = {
    id: '',
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    status: true,
    projects: [], // Initialize projects in the state
};

function reducer(state, action) {
    switch (action.type) {
        case PROJECT_CREATE:
            return {
                ...state,
                projects: [...state.projects, action.payload],
                id: '',
                title: '',
                description: '',
                imageUrl: '',
                linkUrl: '',
                status: true,
            };
        case PROJECT_UPDATE:
            return {
                ...state,
                projects: state.projects.map(project =>
                    project.id === state.id
                        ? { ...project, ...action.payload }
                        : project
                ),
                id: '',
                title: '',
                description: '',
                imageUrl: '',
                linkUrl: '',
                status: true,
            };
        case PROJECT_DELETE:
            return {
                ...state,
                projects: state.projects.filter(project => project.id !== action.payload),
                id: '',
                title: '',
                description: '',
                imageUrl: '',
                linkUrl: '',
                status: true,
            };
        case STATUS_TOGGLE:
            return {
                ...state,
                projects: state.projects.map(project =>
                    project.id === action.payload
                        ? { ...project, status: !project.status }
                        : project
                ),
            };
        case SET_PROJECTS:
            return {
                ...state,
                projects: action.payload,
            };
        case UPDATE_FIELD:
            return {
                ...state,
                [action.field]: action.value,
            };
        default:
            return state;
    }
}

const DefaultData = [
    {
        title: "Earthworm Jim and Pimple Fight",
        description: "Această colecție captivantă de ilustrații conceptuale îți oferă o fereastră spre viitorul imaginației, unde tehnologia și inovația se îmbină într-un spectacol vizual uimitor. Fiecare lucrare se explorează profundă a unor lumi vasta și imaginare, unde tehnologiile de vârf și arhitectura futuristă conturează peisaje fascinante și complexe.",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV56oCt9QxSz_AEF3w-Z_mH08jUHn5MlG-lA&s",
        linkUrl: "https://www.instagram.com/p/C-ELxIdyNsi/?img_index=1",
        status: true
    },
    {
        title: "My Father's Portrait",
        description: "Această lucrare este un portret special care surprinde esența și căldura tatălui meu, un om care a fost nu doar un gardian, dar și un inspirator în primul deosebit. Fiecare detaliu al portretului este realizat cu atenție deosebită, capturând nu doar trăsăturile sale fizice, ci și caracterul său profund și personalitatea sa unică.",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMCC3Y2k3dPYYzNfSKc5PhspV1BObW2PBxtQ&s",
        linkUrl: "https://www.instagram.com/p/C8ptueMyYai/?img_index=1",
        status: true
    }
];

function Dashboard() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { id, title, description, imageUrl, linkUrl, status, projects } = state;

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/data');
        const existingProjects = await response.json();
        const existingTitles = existingProjects.map(project => project.title);

        const shouldPost = DefaultData.some(d => !existingTitles.includes(d.title));
        
        if (shouldPost) {
            for (const project of DefaultData) {
                const postResponse = await fetch('http://localhost:3000/api/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(project),
                });
                const newProject = await postResponse.json();
                dispatch({ type: PROJECT_CREATE, payload: newProject });
            }
        } else {
            dispatch({ type: SET_PROJECTS, payload: existingProjects });
        }
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
};


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        dispatch({
            type: UPDATE_FIELD,
            field: name,
            value: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const project = { title, description, imageUrl, linkUrl, status };

        try {
            if (id) {
                // Update project
                const response = await fetch(`http://localhost:3000/api/data/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(project),
                });
                const updatedProject = await response.json();
                dispatch({ type: PROJECT_UPDATE, payload: updatedProject });
            } else {
                if(!project.description || !project.title || !project.imageUrl || !project.linkUrl) return;
                
                // Create project
                const response = await fetch('http://localhost:3000/api/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(project),
                });
                const newProject = await response.json();
                dispatch({ type: PROJECT_CREATE, payload: newProject });
            }
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    const handleEdit = (project) => {
        dispatch({ type: UPDATE_FIELD, field: 'id', value: project.id });
        dispatch({ type: UPDATE_FIELD, field: 'title', value: project.title });
        dispatch({ type: UPDATE_FIELD, field: 'description', value: project.description });
        dispatch({ type: UPDATE_FIELD, field: 'imageUrl', value: project.imageUrl });
        dispatch({ type: UPDATE_FIELD, field: 'linkUrl', value: project.linkUrl });
        dispatch({ type: UPDATE_FIELD, field: 'status', value: project.status });
    };

    const handleDelete = async (projectId) => {
        try {
            await fetch(`http://localhost:3000/api/data/${projectId}`, {
                method: 'DELETE',
            });
            dispatch({ type: PROJECT_DELETE, payload: projectId });
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleToggle = async (projectId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/data/toggle/${projectId}`, {
                method: 'POST',
            });
            const updatedProject = await response.json();
            dispatch({ type: STATUS_TOGGLE, payload: updatedProject.id });
        } catch (error) {
            console.error('Error toggling project status:', error);
        }
    };

    return (
        <>
        <div className="bg-gradient-to-r from-[#040D12] to-[#1B5778] bg-repeat-y w-full h-screen dashboard-page">
            <h1 className='pt-10 font-extrabold text-5xl text-center text-slate-100'>Dashboard</h1>

            
            <div className='bg-slate-400 bg-opacity-25 mx-2 sm:mx-20 md:mx-20 lg:mx-20 xl:mx-20mt-10 sm:p-10 md:p-10 lg:p-10 xl:p-10 rounded-3xl'>
                <h2 className='mb-4 font-extrabold text-slate-100 text-xl'>Creaza o lucrare:</h2>
                <form onSubmit={handleSubmit} className="space-y-4 sm:grid md:grid lg:grid xl:grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 w-full">
                    <div className='gap-4 xl:grid xl:grid-cols-1'>
                        <label className='flex flex-col'>
                            <p className='mb-4 font-extrabold text-lg text-slate-100'>Title:</p>
                            <input
                                className='p-2 border rounded'
                                name="title"
                                placeholder="Title..."
                                value={title}
                                onChange={handleChange}
                            />
                        </label>
                        <label className='flex flex-col'>
                            <p className='mb-4 font-extrabold text-lg text-slate-100'>Description:</p>
                            <input
                                className='p-2 border rounded'
                                name="description"
                                placeholder="Description..."
                                value={description}
                                onChange={handleChange}
                            />
                        </label>
                        <label className='flex flex-col'>
                            <p className='mb-4 font-extrabold text-lg text-slate-100'>Image URL:</p> 
                            <input
                                className='p-2 border rounded'
                                name="imageUrl"
                                placeholder="Img URL..."
                                value={imageUrl}
                                onChange={handleChange}
                            />
                        </label>
                        <label className='flex flex-col'>
                            <p className='mb-4 font-extrabold text-lg text-slate-100'>Link URL:</p> 
                            <input
                                className='p-2 border rounded'
                                name="linkUrl"
                                placeholder="Link URL..."
                                value={linkUrl}
                                onChange={handleChange}
                            />
                        </label>
                        <label className='flex flex-col'>
                            <p className='mb-4 font-extrabold text-lg text-slate-100'>Status:</p> 
                            <select
                                name="status"
                                value={status}
                                onChange={handleChange}
                                className='p-2 border rounded'
                            >
                                <option value={true}>Show</option>
                                <option value={false}>Hidden</option>
                            </select>
                        </label>
                    </div>
                    <button
                        type="submit"
                        className='active:bg-green-400 m-4 sm:m-0 md:m-0 lg:m-0 xl:m-2 mx-auto sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto rounded w-full sm:w-4/5 xl:w-4/5 font-bold text-white text-xl transition-all strokeyyy hover:scale-105'
                    >
                        {id ? "Update Project" : "Create Project"}
                    </button>
                </form>
            </div>


            <div className="bg-gradient-to-r from-[#040D12] to-[#1B5778] bg-repeat-y p-8 w-full min-h-screen dashboard-projects-page">
            <h2 className='mt-10 font-bold text-2xl text-slate-100'>Projects:</h2>
            <div className="gap-6 grid sm:grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 mt-4">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-slate-200 shadow-lg sm:p-4 md:p-4 lg:p-4 xl:p-4 rounded-lg w-full"
                    >
                        <div className="mb-2">
                            <strong className="text-slate-700">Title:</strong> {project.title}
                        </div>
                        <div className="mb-2">
                            <strong className="text-slate-700">Description:</strong> {project.description}
                        </div>
                        <div className="mb-2">
                            <strong className="text-slate-700">Image URL:</strong> <p className='w-4/5'>{project.imageUrl}</p>
                        </div>
                        <div className="mb-2">
                            <strong className="text-slate-700">Link URL:</strong> <p className='w-4/5'>{project.linkUrl}</p>
                        </div>
                        <div className="mb-2">
                            <strong className="text-slate-700">Status:</strong> {project.status ? 'Show' : 'Hidden'}
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => handleToggle(project.id)}
                                className="hover:bg-slate-700 px-4 py-2 rounded text-slate-950 hover:text-slate-100"
                            >
                                Toggle
                            </button>
                            <button
                                onClick={() => handleEdit(project)}
                                className="hover:bg-slate-700 px-4 py-2 rounded text-slate-950 hover:text-slate-100"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(project.id)}
                                className="hover:bg-slate-700 px-4 py-2 rounded text-slate-950 hover:text-slate-100"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        </div>
        </>
    );
}

export default Dashboard;
