import { useState, useMemo } from 'react'
import { Bin } from '../context/appContext'

import EnableDisableTeacherModal from '../components/modals/EnableDisableBinModal'
import EditBinModal from '../components/modals/EditBinModal'
import DeletedBinModal from '../components/modals/DeletedBinModal'

const UseBins = (bins: Bin[]) => {
    const [bin, setBin] = useState<Bin>()
    const [enableDisableModal, setEnableDisableModal] = useState<boolean>(false)
    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const [editModal, setEditModal] = useState<boolean>(false)
    const [id, setId] = useState<string>('')
    const [level, setLevel] = useState<string>('')


    const binIds = useMemo(() => {
        return bins.map(b => {
            return { label: b.id }
        })
    }, [bins])

    const binLevels = useMemo(() => {
        return bins.map(b => {
            return { label: b.level }
        })
    }, [bins])

    const showEnableDisableBin = (bin: Bin) => {
        setBin(bin)
        setEnableDisableModal(true)
    }

    const showDeleteBin = (bin: Bin) => {
        setBin(bin)
        setDeleteModal(true)
    }

    const showEditBin = (bin: Bin) => {
        setBin(bin)
        setEditModal(true)
    }

    const EnableDisableModal = <>
        {enableDisableModal &&
            <EnableDisableTeacherModal
                bin={bin!}
                enableDisableModal={enableDisableModal}
                setEnableDisableModal={setEnableDisableModal}
            />}
    </>
    const DeleteModal = <>
        {deleteModal &&
            <DeletedBinModal
                bin={bin!}
                deleteModal={deleteModal}
                setDeleteModal={setDeleteModal}

            />}
    </>
    const EditModal = <>
        {editModal &&
            <EditBinModal
                bin={bin!}
                editModal={editModal}
                setEditModal={setEditModal}
            />}
    </>

    return {
        id,
        setId,
        level,
        setLevel,
        bin,
        binIds,
        binLevels,
        enableDisableModal,
        EnableDisableModal,
        showEnableDisableBin,
        deleteModal,
        DeleteModal,
        showDeleteBin,
        editModal,
        EditBinModal,
        EditModal,
        showEditBin
    }
}

export default UseBins;
