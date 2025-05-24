import checkNicknameExists from "@/api/checkNickname";
import createUser from "@/api/users";

const useCreateUser = () => {
    const handleCreateUser = async ({ id, nickname }) => {
        const isDuplicate = await checkNicknameExists(nickname);
        if (isDuplicate) {
            
        }
        return await createUser(id, {
            nickname,
        });
    };  
    return { handleCreateUser };
}

export default useCreateUser;